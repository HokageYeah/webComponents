// setTimeout 模拟实现 setInterval
// 使用闭包实现
function mySetInterval(fn, t) {
    let timer = null;
    function interval() {
      fn();
      timer = setTimeout(interval, t);
    }
    interval();
    return {
      // cancel用来清除定时器
      cancel() {
        clearTimeout(timer);
      }
    };
  }


//  setInterval 模拟实现 setTimeout
function mySetTimeout(fn, time) {
    let timer = setInterval(() => {
      clearInterval(timer);
      fn();
    }, time);
  }
  
  // 使用
  mySetTimeout(() => {
    console.log(1);
  }, 2000);