// 重新连接websocket的机制
function connect() {
  // 创建 WebSocket 连接
  const socket = new WebSocket("ws://localhost:9999");

  // 监听 WebSocket 连接打开事件
  socket.addEventListener("open", () => {
    console.log("WebSocket 连接打开了");

    // 发送消息到服务器
    socket.send("Hello,  我是从客户端发过来的消息");
  });

  // 监听 WebSocket 接收消息事件
  const container = document.getElementById('root') as HTMLElement;
  const div = document.createElement('div');
  container.appendChild(div);
  socket.addEventListener("message", (event) => {
    console.log(`WebSocket 客户端接收的消息: ${event.data}`);
    div.innerText = `${event.data}`;
  });

  // 监听 WebSocket 连接关闭事件
  socket.addEventListener("close", () => {
    console.log("WebSocket connection 关闭了.");
    // 递归调用connect函数来实现自动重连
    setTimeout(() => {
      connect();
    }, 1000);
  });
}

connect();
