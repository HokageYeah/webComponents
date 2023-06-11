const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const nodeURL = require("node:url");

const NotFound = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404</title>
</head>
<body>
    <h2>404 Error，请求的路径不存在 test</h2>
</body>
</html>

`

// 创建服务器
const server = http.createServer((req: any, res: any) => {
  // 设置响应头
  res.setHeader("Content-Type", "text/html");
  res.end(NotFound);
});

const hostname = "127.0.0.1";
let port = 8080;
let count = 0;
const serverRun = () => {
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
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

server.on("error", (error: any) => {
  // 重新启动10次
  if (count < 10) {
    port += 1;
    count += 1;
    serverRun();
  } else {
    console.error("启动服务器失败", error);
    // 将失败log写入日志中去
    errorLog(error);
  }
});

serverRun();
