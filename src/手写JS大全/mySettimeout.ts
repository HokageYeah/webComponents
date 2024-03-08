// settimeout 模拟实现 setinterval(带清除定时器的版本)
// 题目描述:setinterval 用来实现循环定时调用 可能会存在一定的问题 能用 settimeout 解决吗

import { setInterval } from "timers/promises";

const mySetInterval = (fun: Function, time: number) => {
  let timer: any = null;
  const interval = () => {
    fun();
    timer = setTimeout(interval, time);
  };
  interval();
  return {
    cancel: () => {
      clearTimeout(timer);
    },
  };
};

mySetInterval(() => {
  console.log("答应");
}, 1000);

// 使用 setinterval 模拟实现 settimeout 吗？
// const mySetTimeout = (fun: Function, time: number) => {
//   let timer = setInterval(() => {
//     clearInterval(timer)
//     fun();
//   }, time);
// };
// mySetTimeout(() => {
//   console.log("延迟一秒执行");
// }, 1000);
