/**
 * 函数防抖
应用场景：搜索框输入文字后调用对应搜索接口
利用闭包，不管触发频率多高，在停止触发 n 秒后才会执行，如果重复触发，
会清空之前的定时器，重新计时，直到最后一次 n 秒后执行
 * 
 */

/*
 * @param {function} fn - 需要防抖的函数
 * @param {number} time - 多长时间执行一次
 * @param {boolean} flag - 第一次是否执行
 */
function debounce(fn, time, flag) {
  let timer;
  return function (...args) {
    // 在time时间段内重复执行，会清空之前的定时器，然后重新计时
    timer && clearTimeout(timer);
    if (flag && !timer) {
      // flag为true 第一次默认执行
      fn.apply(this, args);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}

function fn(a) {
  console.log("执行:", a);
}
let debounceFn = debounce(fn, 3000, true);
debounceFn(1);
debounceFn(2);
debounceFn(3);

// 先打印：执行: 1
// 3s后打印: 执行: 3
