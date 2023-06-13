import {
  Page,
  getClassName,
  NotFound,
  Template,
  responseTemplate,
  responseErrorPage,
  getRequestUrl,
  isAllowRequest,
} from "./liveServeCommon";
import fs from "fs";
import http from "http";
import path from "path";

// 缓存文件内容
let pageCache = new Map();
// 获取请求的url
let allReqUrl: string[] = [];
// 缓存前面20个请求
const beforeUrl: string[] = [];
// 最大请求容量
const MAX_PAGE_SIZE = 20;
// 缓存错误页面
const NotFoundPageUrl: string[] = [];

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
  console.log("-------内容是什么-------", content);
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

// 读取文件内容
const readFile = (p: string, mode = "utf-8") => {
  try {
    return fs.readFileSync(p);
  } catch (e: any) {
    // 写入失败日志
    errorLog(e);
    return "";
  }
};

// 写入失败日志
const errorLog = (error: string, logName: string = "./Error/myError.log") => {
  // 写入错误日志的内容
  let msg = `\n-------------------------------------时间：${new Date()}-------------------------------------\n报错：${error}\n-----------------------------------------------------------------------------------------------------------------------------`;
  // 文件位置
  const logFilePath = path.resolve(__dirname, logName);
  // 创建文件并且写入文件，追加写入文件中
  fs.appendFile(logFilePath, msg, (err: NodeJS.ErrnoException | null) => {
    if (err) {
      console.warn("日志写入失败！", err);
    }
  });
};
/**
 * 请求的文件
 * @param {*} request 请求
 * @param {*} response 响应
 * @param {*} real_url 真实地址
 * @returns null
 */
const responseContent = async (req: any, res: any) => {
  let real_url = path.join(__dirname, decodeURIComponent(req.url));
  let requestUrl = decodeURIComponent(req.url);
  console.log("-----------responseContent-----------", real_url, requestUrl);
  // 检查文件是否存在
  if (!fs.existsSync(real_url)) {
    console.log(
      "-----------检查文件是否存在-----------",
      fs.existsSync(real_url)
    );
    responseErrorPage(req, res, "请求内容不存在");
    // 缓存本次请求
    NotFoundPageUrl.push(requestUrl);
    return;
  }
  try {
    // 读取文件内容
    const status = fs.statSync(real_url);
    // 如果是文件夹
    if (status.isDirectory()) {
      // 读取文件夹下的所有内容
      curReadFolder(real_url);
      const page = pageCache.get(requestUrl);
      responseTemplate(req, res, page ?? new Page("404.html", NotFound, true));
    } else {
      // 否则不是文件夹 就读取文件
      const fileContent = await readFile(real_url);
      console.log("-----------读取的文件内容-----------", fileContent);
      if (!fileContent) {
        responseErrorPage(req, res, "请求的页面不存在");
        // 缓存本次请求
        NotFoundPageUrl.push(requestUrl);
        return;
      } else {
        console.log("-----------差哈哈哈哈哈-----------", fileContent);
        const page = new Page(requestUrl, fileContent, false);
        responseTemplate(req, res, page);
        pageCache.set(requestUrl, page);
        allReqUrl.push(requestUrl);
        beforeUrl.push(requestUrl);
      }
    }
  } catch (error: any) {
    errorLog(error);
    responseErrorPage(req, res, error);
    // 缓存本次请求
    NotFoundPageUrl.push(requestUrl);
    return;
  }
};
// 检查缓存容量
const checkCache = () => {
  if (pageCache.size > MAX_PAGE_SIZE) {
    beforeUrl.forEach((element: string) => {
      // 删除每个页面缓存
      pageCache.delete(element);
    });
    // 删除请求缓存
    allReqUrl.splice(0, MAX_PAGE_SIZE);
  }
};

// 创建服务器
const server = http.createServer((req: any, res: any) => {
  let req_url = decodeURIComponent(req.url);
  // 判断这个请求的地址是否存在
  // 此处要去除/favicon.ico的请求，这是因为浏览器通常会自动请求 /favicon.ico 路径获取网站的图标。
  // 不然这个文件没有会报错
  if (isAllowRequest(req_url)) {
    const page = pageCache.get(req_url);
    // 检查缓存容量 只缓存前20个页面
    checkCache();
    console.log("-----------createServer-------------", req_url, page);
    const isNotFoundUrl = NotFoundPageUrl.some((item) => item == req_url);
    console.log(
      "-----------createServer请求前错误判断--------------",
      NotFoundPageUrl,
      isNotFoundUrl
    );
    // 判断此次请求是否是缓存的错误请求
    if (isNotFoundUrl) {
      console.log(
        "-----------本次请求NotFoundPageUrl---------------",
        NotFoundPageUrl
      );
      // responseTemplate(req, res, new Page("404.html",NotFound,true))
      responseErrorPage(req, res, "请求的页面不存在");
      return;
    }
    // 判断请求是否已经存在缓存中
    const isAllsReqUrl = allReqUrl.some((item) => item == req_url);
    console.log("-----------本次请求isAllsReqUrl---------------", isAllsReqUrl);
    if (!isAllsReqUrl) {
      responseContent(req, res);
      return;
    }
    // 如果页面不存在 要么读取内容，要么显示文件
    console.log("-----------serverPage----------", page);
    if (!page) {
      responseContent(req, res);
      return;
    }
    responseTemplate(req, res, page ?? new Page("404.html", NotFound, true));
  }
});

const hostname = "127.0.0.1";
let port = 8082;
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
