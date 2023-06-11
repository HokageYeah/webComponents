const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const nodeURL = require("node:url");

const NotFound = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404</title>
</head>

<body>
  <h2>404 error,请求路径不存在</h2>
</body>

</html>
`;

const ReqError = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>5xx错误</title>
</head>

<body>
  <h2>未知错误！</h2>
</body>

</html>
`;

const Template = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>template</title>
  <style>
    * {
      margin: 0;
      padding: 0;
    }

    body {
      height: 100vh;
      background-color: #ddd;
    }

    .folder {
      position: relative;
    }

    .folder::before {
      content: '📦';
    }

    .file::before {
      content:'📦';
    }

 
    .html-file::before {
      content: '🧱';
    }

    .log-file::before {
      content: '📄';
    }
    .css-file::before {
      content: '📒';
    }

    .js-file::before {
      content: '🎃';
    }
    .pdf-file::before {
      content: '📕';
    }

    .gif-file::before {
      content: '👓';
    }

    .img-file::before {
      content: '💎';
    }

    a {
      text-decoration: none;
      cursor: pointer;
      color: #000;
      transition: all ease-in-out 0.3s;
    }

    a:hover {
      color: teal;
    }

    .container {
      display: flex;
      width: 75%;
      margin: 0 auto;
      margin-top: 100px;
      flex-wrap: wrap;

    }

    .container a {
      display: inline-block;
      margin: 10px;
      width: 200px;
      padding: 10px;
    }
  </style>
</head>

<body>
  <div class="container"></div>
</body>

</html>
`;

const dirname = __dirname;

// 缓存加载过程中的页面
const pageCache = new Map();
const allReqUrl = [];

// 获取文件后缀
const getExt = (urlString) => path.extname(nodeURL.parse(urlString).pathname);
const isHTML = (file) => /\.html$/.test(file);
const isCss = (file) => /\.css$/.test(file);
const isJs = (file) => /\.js$/.test(file);
const isImage = (file) =>
  /(.*)\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp)$/.test(file);
// 针对不同请求返回不同格式
const getType = (url, is_html = false) =>
  is_html
    ? "text/html;charset=utf-8"
    : mimeTypes[getExt(url)] || `text/plain;charset=utf-8`;

class Page {
  constructor(url, content, is_html = false) {
    this.pageUrl = url;
    this.content = content;
    this.contentType = getType(url, is_html);
  }
}

const getTagStr = (url, isFolder = false) => {
  const fileName = path.basename(url);
  if (isFolder) {
    return `<a class="folder" href="${url}">${fileName}</a>`;
  } else {
    return `<a class="file ${getClassName(url)}" href="${url}">${fileName}</a>`;
  }
};

const getRequestUrl = (folderPath) =>
  folderPath.split(__dirname)[1].replace(/\\/gi, "/");

const readFile = (p, mode = "utf-8") => {
  try {
    return fs.readFileSync(p);
  } catch (e) {
    errorLog(e);
    return "";
  }
};

const errorLog = (msg, log = "error.log") => {
  msg = `\n=================${new Date()}==============\n ${msg} \n==============================================================================`;
  fs.appendFile(path.resolve(__dirname, log), msg, (err) => {
    if (err) {
      console.warn("日志写入失败！", err);
    }
  });
};

// 暂时不处理ico格式文件
// 在此处可以错拦截请求管理
const isAllowResolve = (file) => {
  return !/\.ico$/.test(file);
};

const mimeTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".mp4": "video/mp4",
  ".json": "application/json",
};

const getClassName = (url) =>
  isImage(url) ? "img-file" : `${getExt(url).replace(/\./, "")}-file`;

// 缓存错误页面
const NotFoundPageUrl = [];
const ErrorPageUrl = [];

const server = http.createServer((request, response) => {
  const req_url = request.url;

  // 是否是错误请求
  if (NotFoundPageUrl.indexOf(request.url) !== -1) {
    responseTemplate(request, response, new Page("404.html", NotFound, true));
    console.log("404-pages", NotFoundPageUrl);
    return;
  }

  // 是否是允许的请求
  if (isAllowResolve(req_url)) {
    // 请求是否存在以及是否缓存了
    if (allReqUrl.indexOf(req_url) === -1) {
      responseContent(request, response);
      return;
    }
    // 响应处理
    const page = pageCache.get(request.url);
    if (!page) {
      responseContent(request, response);
      return;
    }
    responseTemplate(
      request,
      response,
      page ?? new Page("404.html", NotFound, true)
    );
  }
});

const responseContent = (request, response) => {
  let real_url = path.join(__dirname, request.url);
  try {
    const status = fs.statSync(real_url);

    if (status.isDirectory()) {
      // 读取文件夹内容
      curReadFolder(real_url);
      // 响应一个生成的页面
      const page = pageCache.get(request.url);
      responseTemplate(
        request,
        response,
        page ?? new Page("404.html", NotFound, true)
      );
      return;
    } else {
      const content = readFile(real_url);
      if (!content) {
        responseTemplate(
          request,
          response,
          new Page("404.html", NotFound, true)
        );
        // 缓存本次请求
        NotFoundPageUrl.push(request.url);
        return;
      } else {
        // 响应页面内容
        const this_page = new Page(request.url, content, false);
        responseTemplate(request, response, this_page);
        // 缓存本次请求
        allReqUrl.push(request.url);
        pageCache.set(request.url, this_page);
      }
    }
  } catch (error) {
    let errorContent = NotFound.replace(
      /<h2>(.*?)<\/h2>/,
      `<h2 style="color:red;">${error}<\/h2>`
    );
    if (error.toString().indexOf("no such file or directory") !== -1) {
      // 检查是否是编码问题
      const decodeUrl = decodeURIComponent(real_url);
      const content = readFile(decodeUrl);
      if (!content) {
        responseTemplate(
          request,
          response,
          new Page("404.html", NotFound, true)
        );
        // 缓存本次请求
        NotFoundPageUrl.push(request.url);
        errorLog(error.toString());
        return;
      } else {
        // 响应页面内容
        const this_page = new Page(real_url, content, false);
        responseTemplate(request, response, this_page);
        // 缓存本次请求
        allReqUrl.push(real_url);
        pageCache.set(real_url, this_page);
      }
    } else {
      responseTemplate(
        request,
        response,
        new Page("5xx.html", errorContent, true)
      );
      ErrorPageUrl.push(request.url);
      errorLog(error.toString());
    }
  }
};

// 响应页面
const responseTemplate = (request, response, page) => {
  response.setHeader("Content-Type", page.contentType);
  response.setHeader("Content-length", page.content.length);
  response.write(page.content);
  response.end();
};

// 递归读取整个文件夹下所有文件
const curReadFolder = async (folderPath = __dirname) => {
  let temp = "";
  // 读取当前文件夹下所有文件
  const files = fs.readdirSync(folderPath);
  files.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName);
    try {
      // 将文件映射到请求中
      let this_url = getRequestUrl(filePath);
      // 缓存所有请求
      // this_url = encodeURIComponent(this_url)
      temp += getTagStr(this_url, fs.statSync(filePath).isFolder);
      allReqUrl.push(this_url);
    } catch (error) {
      errorLog(error);
      console.warn("stats error:", error);
    }
  });

  let reqUrl = folderPath === __dirname ? "/" : getRequestUrl(folderPath);
  let title = path.basename(reqUrl) === "/" ? "首页" : path.basename(reqUrl);
  // 模板内容替换
  let content = Template.replace(
    /<title>(.*)<\/title>/,
    `<title>${title}<\/title>`
  ).replace(
    /<div class="container">(.*)<\/div>/,
    `<div class="container">${temp}</div>`
  );
  pageCache.set(reqUrl, new Page(reqUrl, content, true));
};

let port = 8080;

let count = 0;
function run() {
  server.listen(port, () => {
    curReadFolder();
    console.log(`服务器启动成功！点击访问 http://localhost:${port}`);
  });
}

server.on("error", (error) => {
  if (count < 10) {
    // 重启10次失败
    port += 1;
    count += count;
    run();
  } else {
    console.error("启动失败:", error);
    errorLog(error);
  }
});

run();
