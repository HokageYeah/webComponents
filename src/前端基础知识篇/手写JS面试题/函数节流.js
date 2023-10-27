/**
 * 函数节流
应用场景： 下拉滚动加载

利用闭包，不管触发频率多高，每隔一段时间内执行一次
 */

/*
 * @param {function} fn - 需要防抖的函数
 * @param {number} time - 多长时间执行一次
 * @param {boolean} flag - 第一次是否执行
 */
function throttle(fn, time, flag) {
  let timer;
  return function (...args) {
    // flag控制第一次是否立即执行
    if (flag) {
      fn.apply(this, args);
      // 第一次执行完后，flag变为false；否则以后每次都会执行
      flag = false;
    }
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args);
        // 每次执行完重置timer
        timer = null;
      }, time);
    }
  };
}

// 测试
function fn() {
  console.log("fn");
}
let throttleFn = throttle(fn, 3000, true);
setInterval(throttleFn, 500);

// 测试结果，一开始就打印"fn", 以后每隔3s打印一次"fn"
