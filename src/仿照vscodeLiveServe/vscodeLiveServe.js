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
  <style>

  * {
    margin: 0;
    padding: 0;
  }

  html,body {
    height: 100vh;
    background:url("https://cdn.staticaly.com/gh/wuxin0011/blog-resource@main/fantasy/screen.png");
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h2 {
    font-size:40px;
  }

</style>
</head>

<body>
  <h2>未知错误</h2>
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
      .unknown-file::before {
        content: '❓';
      }
      .folder::before,.file::before{
        content: '👝';
      }
      .html-file::before {
        content: '📘';
      }
      .log-file::before,.json-file::before {
        content: '📄';
      }
      .css-file::before {
        content: '🌼';
      }
      .js-file::before {
        content: '🍟';
      }
      .ini-file::before,.config-file::before,.xml-file::before {
        content: '🍎';
      }
      .js-file::before {
        content: '🥧';
      }
      .java-file::before{
        content: '🍉';
      }
      .class-file::before,.md-file::before,.iml-file::before{
        content: '🍖';
      }
      .jar-file::before,.docker-file::beforej,.exe-file::before,.sql-file::before,run-file::before{
        content: '🚀';
      }
      .pdf-file::before {
        content: '📕';
      }
      .link-file::before,.lnk-file::before,.ink-file::before,.gif-file::before{
        content: '🔗';
      }
      .img-file::before {
        content: '🔎';
      }
      .doc-file::before , .docx-file::before{
        content: '📝';
      }
      .ppt-file::before , .pptx-file::before{
        content: '🧨';
      }
      .xlsx-file::before , .xls-file::before{
        content: '📊';
      }
      .ttf-file::before , .woff-file::before,.woff2-file::before{
        content: '🌰';
      }
      .ogg-file::before , .mp3-file::before{
        content: '🥭';
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

// 获取文件后缀
const getExt = (urlString) => path.extname(nodeURL.parse(urlString).pathname);

// 文件类型判断
const isHTML = (file) => /\.html$/.test(file);
const isCss = (file) => /\.css$/.test(file);
const isJs = (file) => /\.js$/.test(file);
const isImage = (file) =>
  /(.*)\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp)$/.test(file);
const isLink = (file) => /\.(link|lnk|ink)$/.test(file);
const isRunFile = (file) =>
  /\.(exe|sh|com|bat|msi|dll|bin|out|pl|py|jar)$/.test(file);
const isConfigFile = (file) =>
  /\.(ini|conf|cfg|rc|properties|plist|htaccess|cnf)$/.test(file);
const isClassFile = (file) => /\.(class)$/.test(file);
const isJavaFile = (file) => /\.(java)$/.test(file);
// 针对不同请求返回不同格式
const getType = (url, is_html = false) =>
  is_html
    ? "text/html;charset=utf-8"
    : MEDIA_TYPE[getExt(url)] || `text/plain;charset=utf-8`;

const getTagStr = (url, isFolder = false) => {
  const fileName = path.basename(url);
  if (isFolder) {
    return `<a class="folder" href="${url}">${fileName}</a>`;
  } else {
    return `<a class="file ${getClassName(
      url
    )}" href="${url}" >${fileName}</a>`;
  }
};

// 将 \ 或者 \\ 或者 // 转换成 /
const getRequestUrl = (folderPath) =>
  ("/" + folderPath.split(__dirname)[1].replace(/\\\\/gi, "/"))
    .replace(/\\/gi, "/")
    .replace(/\/\/\//g, "/")
    .replace(/\/\//g, "/");

// 文件同步读取
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
  fs.appendFile(path.join(__dirname, log), msg, (err) => {
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

const MEDIA_TYPE = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".bmp": "image/bmp",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".csv": "text/csv;charset=utf-8",
  ".html": "text/html;charset=utf-8",
  ".txt": "text/plain;charset=utf-8",
  ".log": "text/plain;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".md": "application/markdown",
  ".xml": "application/xml",
  ".pdf": "application/pdf",
  ".xlsx": "application/vnd.ms-excel",
  ".xls": "application/vnd.ms-excel",
  ".doc": "application/msword",
  ".docx": "application/msword",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.ms-powerpoint",
  ".ttf": "application/font-woff",
  ".woff": "application/font-woff",
  ".woff2": "application/font-woff",
  ".zip": "application/zip",
  ".mp4": "video/mp4",
  ".json": "application/json",
  ".webm": "video/webm",
  ".ogg": "video/ogg",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
};

const getClassName = (url) => {
  if (isImage(url)) {
    return "img-file";
  }
  if (isLink(url)) {
    return "link-file";
  }
  if (isRunFile(url)) {
    return "run-file";
  }
  if (isHTML(url)) {
    return "html-file";
  }
  if (isJs(url)) {
    return "js-file";
  }
  if (isCss(url)) {
    return "css-file";
  }
  if (isJavaFile(url)) {
    return "java-file";
  }
  if (isClassFile(url)) {
    return "class-file";
  }
  if (isConfigFile(url)) {
    return "config-file";
  }
  return MEDIA_TYPE[getExt(url)]
    ? `${getExt(url).replace(/\./, "")}-file`
    : "unknown-file";
};

// 缓存加载过程中的页面
const pageCache = new Map();
// 所有请求
const allReqUrl = [];
// 最大请求容量
const MAX_PAGE_SIZE = 20;
// 缓存前面20个请求
const beforeUrl = [];

// 缓存错误页面
const NotFoundPageUrl = [];
const ErrorPageUrl = [];

class Page {
  constructor(url, content, is_html = false) {
    this.pageUrl = url;
    this.content = content;
    this.contentType = getType(url, is_html);
  }
}

// 检查缓存容量
const checkCache = () => {
  if (pageCache.size > MAX_PAGE_SIZE) {
    // 释放缓存
    beforeUrl.forEach((before) => {
      // 删除页面缓存
      pageCache.delete(before);
    });
    // 删除请求缓存
    allReqUrl.splice(0, MAX_PAGE_SIZE);
  }
};

/**
 * 启动入口
 * server 是一个服务实例对象
 */
const server = http.createServer((request, response) => {
  let req_url = decodeURIComponent(request.url);
  // 是否是错误请求
  if (NotFoundPageUrl.indexOf(request.url) !== -1) {
    responseTemplate(request, response, new Page("404.html", NotFound, true));
    console.log("404-pages", NotFoundPageUrl);
    return;
  }
  // 是否是允许的请求
  if (isAllowResolve(req_url)) {
    checkCache();

    // 请求是否存在以及是否缓存了如果请求没有缓存走该请求
    if (allReqUrl.indexOf(req_url) === -1) {
      responseContent(request, response);
      return;
    }
    // 响应处理
    const page = pageCache.get(req_url);
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

/**
 * 请求的文件
 * @param {*} request 请求
 * @param {*} response 响应
 * @param {*} real_url 真实地址
 * @returns null
 */
const responseContent = (request, response) => {
  let real_url = path.join(__dirname, decodeURIComponent(request.url));
  let requestUrl = decodeURIComponent(request.url);
  console.log('----检查文件是否存在----', fs.existsSync(real_url));
  // 检查文件是否存在
  if (!fs.existsSync(real_url)) {
    responseErrorPage(request, response, "请求内容不存在");
  }

  try {
    const status = fs.statSync(real_url);
    if (status.isDirectory()) {
      // 读取文件夹内容
      curReadFolder(real_url);
      // 响应一个生成的页面
      const page = pageCache.get(requestUrl);
      responseTemplate(
        request,
        response,
        page ?? new Page("404.html", NotFound, true)
      );
      return;
    } else {
      const content = readFile(real_url);
      if (!content) {
        responseErrorPage(request, response, "请求内容不存在");
        // 缓存本次请求
        NotFoundPageUrl.push(requestUrl);
        return;
      } else {
        // 响应页面内容
        const this_page = new Page(requestUrl, content, false);
        responseTemplate(request, response, this_page);
        // 缓存本次请求
        allReqUrl.push(requestUrl);
        beforeUrl.push(requestUrl);
        pageCache.set(requestUrl, this_page);
      }
    }
  } catch (error) {
    responseErrorPage(request, response, error);
    return;
  }
};

/**
 * 响应一个异常请求的页面
 * @param {*} request request
 * @param {*} response  response
 * @param {*} message 错误详情
 * @param {*} template 指定错误模板
 * @param {*} url 错误连接，默认是 请求地址
 */
const responseErrorPage = (request, response, message, template, url) => {
  let errorContent = null;
  url = url ?? request.url;
  template = template ?? NotFound;
  if (message) {
    errorContent = template.replace(
      /<h2>(.*?)<\/h2>/,
      `<h2 style="color:red;">${message.toString()}<\/h2>`
    );
  }
  responseTemplate(
    request,
    response,
    new Page(url, message && errorContent ? errorContent : ReqError, true)
  );
};

/**
 * 响应内容
 * @param {*} request 请求
 * @param {*} response 响应
 * @param {*} page page类的对象
 */
const responseTemplate = (request, response, page) => {
  console.log('---------创建模板-------------');
  response.setHeader("Content-Type", page.contentType);
  // 这个不知道为什么报错，如果设置内容长度短
  // response.setHeader('Content-length', page.content.length);
  response.write(page.content);
  response.end();
};

/**
 * 响应文件下第一层文件，包括文件和目录
 * @param {*} folderPath 路径
 */
const curReadFolder = (folderPath = __dirname) => {
  let temp = "";
  // 读取当前文件夹下所有文件
  const files = fs.readdirSync(folderPath);
  files.forEach((fileName) => {
    const filePath = path.join(folderPath, fileName);
    try {
      // 将文件映射到请求中
      let this_url = getRequestUrl(filePath);
      let isDirectory = fs.statSync(filePath).isDirectory();
      temp += getTagStr(this_url, isDirectory);
    } catch (error) {
      errorLog(error);
      console.warn("stats error:", error);
    }
  });
  let reqUrl =
    folderPath === __dirname
      ? "/"
      : decodeURIComponent(getRequestUrl(folderPath));
  let title =
    path.basename(reqUrl) === "/" || path.basename(reqUrl) === ""
      ? "首页"
      : path.basename(reqUrl);
  console.log('查看数据哈哈哈哈：',reqUrl, title , path.basename(reqUrl));
  // 模板内容替换
  let content = Template.replace(
    /<title>(.*?)<\/title>/,
    `<title>${title}</title>`
  ).replace(
    /<div class="container">(.*?)<\/div>/,
    `<div class="container">${temp}</div>`
  );
  pageCache.set(reqUrl, new Page(reqUrl, content, true));
  allReqUrl.push(reqUrl);
  beforeUrl.push(reqUrl);
};

// 启动参数
let port = 8080;
let count = 0;

const repeatStart = (error) => {
  if (count < 10) {
    // 重启10次失败
    port += 1;
    count += 1;
    run();
  } else {
    console.error("启动失败:", error);
    server.close();
    errorLog(error);
  }
};

const run = () => {
  server.close();
  try {
    server.listen(port, () => {
      curReadFolder();
      console.log(`服务器启动成功！点击访问 http://localhost:${port}`);
    });
    server.on("error", (error) => {
      repeatStart(error);
    });
  } catch (error) {
    repeatStart(error);
  }
};

run();
