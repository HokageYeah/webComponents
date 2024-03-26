import { promises } from "dns";

// 控制请求最大并发数，前面的请求成功后，再发起新的请求
const controlMaxReq = (list, number) => {
  function fn() {
    if (!list.length) return;
    let max = Math.min(list.length, number);
    for (let i = 0; i < max; i++) {
      let f: any = list.shift();
      number--;
      f.finally(() => {
        number++;
        fn();
      });
    }
  }
  fn();
};
