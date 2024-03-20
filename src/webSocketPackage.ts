// webSocket通信js封装: https://blog.csdn.net/qq_38746300/article/details/128675243
let websock: WebSocket | null = null;
let rec: NodeJS.Timeout | undefined; //断线重连后，延迟5秒重新创建WebSocket连接  rec用来存储延迟请求的代码
let isConnect = false; //咯安姐标识， 避免重复连接
let checkMsg = "hearbeat"; // 心跳发送/返回的信息 服务器和客户端收到的信息内容如果如下 就识别为心跳信息 不要做业务处理

let globalCallback = new Map();

let createWebSocket = () => {
  try {
    initWebSocket(); //初始化websocket连接
  } catch (error) {
    console.log("尝试创建连接失败");
    reConnect(); //如果无法连接上webSocket 那么重新连接！可能会因为服务器重新部署，或者短暂断网等导致无法创建连接
  }
};

// 初始化websocket
let initWebSocket = () => {
  const wsUrl = "ws://localhost:9999";
  websock = new WebSocket(wsUrl);
  // 监听服务端消息推送过来
  websock.onmessage = function (e: MessageEvent<any>) {
    websocketonmessage(e);
  };
  // 监听服务端消息通道关闭
  websock.onclose = function (e: CloseEvent) {
    websocketclose(e);
  };
  // 创建 websocket 连接
  websock.onopen = function (e: Event) {
    websocketOpen(e);
    heartCheck.start();
  };

  // 连接发生错误的回调方法
  websock.onerror = function () {
    console.log("WebSocket连接发生错误");
    isConnect = false; //连接断开修改标识
    reConnect(); //连接错误 需要重连
  };
};

// 定义重新连接函数
let reConnect = () => {
  console.log("尝试重新连接");
  if (isConnect) return;
  rec && clearTimeout(rec);
  // 延迟5秒重连  避免过多次过频繁请求重连
  rec = setTimeout(() => {
    createWebSocket();
  }, 5000);
};

//心跳设置
var heartCheck = {
  timeout: 20000, //每段时间发送一次心跳包 这里设置为20s
  timeoutObj: null as NodeJS.Timer | null, //延时发送消息对象（启动心跳新建这个对象，收到消息后重置对象）

  start: function () {
    this.timeoutObj = setInterval(function () {
      console.log("hearting ....");
      if (isConnect) (websock as WebSocket).send(checkMsg);
    }, this.timeout);
  },

  reset: function () {
    clearInterval(this.timeoutObj);
    this.start();
  },

  stop: function () {
    clearInterval(this.timeoutObj);
  },
};

// 数据接收
let websocketonmessage = (e: MessageEvent<any>) => {
  let ret = JSON.parse(decodeUnicode(e.data));
  if (!ret) {
    heartCheck.reset();
  } else {
    if (ret.msg === "websocket connect success") {
    } else {
      if (ret.method === "webSocket_device_transport") {
        const callback = globalCallback.get(ret.sn);

        if (callback && typeof callback === "function") callback(ret);
      } else if (ret.method === "webSocket_device_alarm") {
        const callback = globalCallback.get("deviceAlert");
        if (callback && typeof callback === "function") callback(ret);
      }
    }
  }
};
let decodeUnicode = (str: string) => {
  str = str.replace(/\\/g, "%");
  //转换中文
  str = unescape(str);
  //将其他受影响的转换回原来
  str = str.replace(/%/g, "\\");
  //对网址的链接进行处理
  str = str.replace(/\\/g, "");
  return str;
};

// 关闭
let websocketclose = (e: CloseEvent) => {
  console.log("关闭了=====>", e);
  isConnect = false;
  heartCheck.stop(); //关闭心跳
  console.log("connection closed (" + e.code + ")");
};

//设置关闭连接
let closeWebSocket = () => {
  (websock as WebSocket).close();
};

// 创建websocket连接
let websocketOpen = (e: Event) => {
  isConnect = true;
  console.log("连接成功");
};

// 数据发送
let websocketsend = (agentData: any) => {
  console.log("数据发送", JSON.stringify(agentData));
  // 发消息给服务器
  (websock as WebSocket).send(JSON.stringify(agentData));
};

// 实际调用的方法
let sendSock = (agentData: any, callback: Function, key: string) => {
  if (!websock) {
    // initWebSocket();
    createWebSocket();
  }
  globalCallback.set(key, callback);
  if ((websock as WebSocket).readyState === (websock as WebSocket).OPEN) {
    // 若是ws开启状态
    websocketsend(agentData);
  } else if (
    (websock as WebSocket).readyState === (websock as WebSocket).CONNECTING
  ) {
    // 若是 正在开启状态，则等待1s后重新调用
    setTimeout(function () {
      sendSock(agentData, callback, key);
    }, 2000);
  } else {
    // 若未开启 ，则等待1s后重新调用
    setTimeout(function () {
      sendSock(agentData, callback, key);
    }, 2000);
  }
};

let getSock = (key: string, callback: Function) => {
  globalCallback.set(key, callback);
};

// 将方法暴露出去
export { sendSock, getSock, createWebSocket, closeWebSocket, initWebSocket };
