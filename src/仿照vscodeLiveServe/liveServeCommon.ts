const path = require("node:path");
const nodeURL = require("node:url");

export const NotFound = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404</title>
</head>
<body>
    <h2>404 Error，哈哈哈请求的路径不存在 test</h2>
</body>
</html>

`;

export const Template = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>templage</title>
    <style>
    *{
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
      content: '📂';
    }
    .html-file::before{
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
      transition: all ease-in-out 0.3s;
    }
    a:hover {
      color: orange;
    }
    .container {
      display: flex;
      width: 60%;
      margin: 0 auto;
      background: yellow;
      flex-wrap: wrap;
      margin-top: 180px;
    }
    .container > a{
      margin:20px;
    }
    </style>
</head>
<body>
    <div class="container">测试</div>
</body>
</html>
`;

/**
 * 响应一个异常请求的页面
 * @param {*} request request
 * @param {*} response  response
 * @param {*} message 错误详情
 * @param {*} template 指定错误模板
 * @param {*} url 错误连接，默认是 请求地址
 */
export const responseErrorPage = (
  req: any,
  res: any,
  message: string,
  template?: string,
  url?: string
) => {
  url = url ?? req.url;
  template = template ?? NotFound;
  let errorHtml = "";
  if (message) {
    errorHtml = template.replace(
      /<h2>(.*?)<\/h2>/,
      `<h2 style="color:red;">${message.toString()}<\/h2>`
    );
  }
  console.log('-----------responseErrorPage------------')
  responseTemplate(
    req,
    res,
    new Page(url as string, message && errorHtml ? errorHtml : "ReqError", true)
  );
};

// 文件类型判断
const isHTML = (file: string) => /\.html$/.test(file);
const isCss = (file: string) => /\.css$/.test(file);
const isJs = (file: string) => /\.js$/.test(file);
const isImage = (file: string) =>
  /(.*)\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp)$/.test(file);
const isLink = (file: string) => /\.(link|lnk|ink)$/.test(file);
const isRunFile = (file: string) =>
  /\.(exe|sh|com|bat|msi|dll|bin|out|pl|py|jar)$/.test(file);
const isConfigFile = (file: string) =>
  /\.(ini|conf|cfg|rc|properties|plist|htaccess|cnf)$/.test(file);
const isClassFile = (file: string) => /\.(class)$/.test(file);
const isJavaFile = (file: string) => /\.(java)$/.test(file);

export const MEDIA_TYPE: any = {
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
  ".ogg1": "audio/ogg",
  '.ts': 'text/javascript; charset=utf-8',
};

// 针对不同的请求返回的格式不同
export const getType = (url: string, is_html: boolean = false) => {
  return is_html
    ? "text/html;charset=utf-8"
    : MEDIA_TYPE[getExt(url)] || "text/plain;charset=utf-8";
};

// 获取文件后缀
export const getExt = (urlString: string): string =>
  path.extname(nodeURL.parse(urlString).pathname);

// 创建返回类
export class Page {
  pageUrl: string;
  content: Buffer | string;
  contentType: any;
  constructor(url: string, content: Buffer | string, is_html = false) {
    this.pageUrl = url;
    this.content = content;
    this.contentType = getType(url, is_html);
  }
}
export const getClassName = (fileUrl: string) => {
  if (isImage(fileUrl)) {
    return "img-file";
  }
  if (isLink(fileUrl)) {
    return "link-file";
  }
  if (isRunFile(fileUrl)) {
    return "run-file";
  }
  if (isHTML(fileUrl)) {
    return "html-file";
  }
  if (isJs(fileUrl)) {
    return "js-file";
  }
  if (isCss(fileUrl)) {
    return "css-file";
  }
  if (isJavaFile(fileUrl)) {
    return "java-file";
  }
  if (isClassFile(fileUrl)) {
    return "class-file";
  }
  if (isConfigFile(fileUrl)) {
    return "config-file";
  }
  return MEDIA_TYPE[getExt(fileUrl)]
    ? `${getExt(fileUrl)}-file`
    : "unknown-file";
};

// 创建模板
export const responseTemplate = (req: any, res: any, page: Page) => {
  console.log('---------创建模板-------------', page.contentType);
  // 设置响应头
  res.setHeader("Content-Type", page.contentType);
  res.write(page.content);
  res.end();
};

// 获取请求链接
export const getRequestUrl = (folderPath: string) =>
folderPath.split(__dirname)[1].replace(/\\/gi, "/");

// 过滤掉/favicon.ico的请求
export const isAllowRequest = (req_url: string) => {
  // 是否包含ico 的请求, 不要ico的请求
  const isico = /\.ico$/.test(req_url)
  return !isico
}