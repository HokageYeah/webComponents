// 使用setTimeout实现setInterval

function mySetinterval(fun, timeout) {
  let timer = setTimeout(() => {
    fun();
    mySetinterval(fun, timeout);
  }, timeout);
  return timer;
}

mySetinterval(() => {
  // 打印当前时间并且转成时分秒
  console.log(new Date());
}, 1000);
