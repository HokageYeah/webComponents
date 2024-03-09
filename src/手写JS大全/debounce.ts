// 防抖
const debounce = (fun: Function, time: number) => {
  let timer: any;
  function callback(this: any) {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fun.apply(this, args);
    }, time);
  }
  return callback;
};

// 节流
const throttle = (fun: Function, time: number) => {
  let flag = true;
  return () => {
    if (flag) {
      flag = false;
      setTimeout(() => {
        fun();
        flag = true;
      }, time);
    }
  };
};

// node中模拟1秒点击一次
for (let i = 1; i < 5; i++) {
  setTimeout(
    debounce(() => {
      console.log("打印");
    }, 2000),
    500
  );
}
