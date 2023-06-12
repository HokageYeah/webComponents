import { MEDIA_TYPE, getExt, Page, getClassName, NotFound, Template } from "./liveServeCommon";
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const nodeURL = require("node:url");

// 缓存文件内容
let pageCache = new Map();
// 获取请求的url
let allReqUrl = [];
// 缓存前面20个请求
const beforeUrl = [];
// 最大请求容量
const MAX_PAGE_SIZE = 20;

// 递归获取当前文件夹下所有文件
const curReadFolder = (folderPath: string = __dirname) => {
  let temp = "";
  // 读取当前文件夹下所有文件
  const filePath: string[] = fs.readdirSync(folderPath);
  console.log("读取当前文件夹下文件：", filePath);
  filePath.forEach((fileName: string) => {
    try {
      // 读取文件里的内容
      const filePath = path.resolve(folderPath, fileName);
      let this_url = getRequestUrl(filePath);
      // 是否为目录
      console.log("this_url", this_url, fs.statSync(filePath).isDirectory());
      temp += getTagStr(this_url, fs.statSync(filePath).isDirectory());
      // 把拼接的html字符串放入模板中
    } catch (error: any) {
      errorLog(error);
      console.warn("stats error:", error);
    }
  });
  let reqUrl = folderPath === __dirname ? "/" : getRequestUrl(folderPath);
  let title = path.basename(reqUrl) === "/" ? "首页" : path.basename(reqUrl);
  console.log("所有的拼接已经完成：", temp);
  console.log("查看数据：", reqUrl, title, path.basename(reqUrl));
  let content = Template.replace(
    /<title>(.*)<\/title>/,
    `<title>${title}</title>`
  ).replace(
    /<div class="container">(.*)<\/div>/,
    `<div class="container">${temp}</div>`
  );
  console.log(content);
  pageCache.set(reqUrl, new Page(reqUrl, content, true));
  allReqUrl.push(reqUrl);
  beforeUrl.push(reqUrl);
};

const getTagStr = (url: string, isDirectory: boolean = false) => {
  const fileName = path.basename(url);
  console.log("basename", fileName);
  // 如果是文件夹
  if (isDirectory) {
    return `<a class="folder" href="${url}">${fileName}</a>`;
  } else {
    return `<a class="file ${getClassName(
      fileName
    )}" href="${url}">${fileName}</a>`;
  }
};

// const getClassName = (fileName: string) => {
//   // 判断是不是图片
//   const imageExtensions =
//     /\.(png|jpg|jpeg|apng|avif|bmp|gif|ico|cur|svg|tiff|webp)$/i;
//   const isImage = imageExtensions.test(fileName);
//   const exrName = getExt(fileName);
//   console.log("获取文件后缀", exrName);
//   return isImage ? "image-file" : `${exrName}-file`;
// };

const getRequestUrl = (folderPath: string) =>
  folderPath.split(__dirname)[1].replace(/\\/gi, "/");

const readFile = (p: any, mode = "utf-8") => {
  try {
    return fs.readFileSync(p);
  } catch (e: any) {
    // 写入失败日志
    errorLog(e);
    return "";
  }
};

// 写入失败日志
const errorLog = (error: string, logName: string = "myError.log") => {
  // 写入错误日志的内容
  let msg = `\n--------------------时间：${new Date()}----------------\n报错：${error}\n------------------------------`;
  // 文件位置
  const logFilePath = path.resolve(__dirname, logName);
  // 创建文件并且写入文件，追加写入文件中
  fs.appendFile(logFilePath, msg, (err: Error) => {
    if (err) {
      console.warn("日志写入失败！", err);
    }
  });
};

// 创建模板
const responseTemplate = (req: any, res: any, page: Page) => {
  // 设置响应头
  res.setHeader("Content-Type", page.contentType);
  res.write(page.content);
  res.end();
};

// 创建服务器
const server = http.createServer((req: any, res: any) => {
  let req_url = decodeURIComponent(req.url);
  const page = pageCache.get(req_url);
  console.log("-----------createServer-------------", req_url, page);
  responseTemplate(req, res, page ?? new Page("404.html", NotFound, true));
});

const hostname = "127.0.0.1";
let port = 8080;
let count = 0;
const serverRun = () => {
  server.close();
  try {
    server.listen(port, hostname, () => {
      curReadFolder();
      console.log(`Server running at http://${hostname}:${port}/`);
    });
    server.on("error", (error: any) => {
      // 重新启动10次
      repeatStart(error);
    });
  } catch (error: any) {
    repeatStart(error);
  }
};

// 重新启动
const repeatStart = (error: string) => {
  // 重新启动10次
  if (count < 10) {
    port += 1;
    count += 1;
    serverRun();
  } else {
    console.error("启动服务器失败", error);
    // 将失败log写入日志中去
    errorLog(error);
    server.close();
  }
};

serverRun();
