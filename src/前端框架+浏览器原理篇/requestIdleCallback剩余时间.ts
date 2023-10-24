// 该函数的执行时间超过1s
function calc() {
  let start = performance.now();
  let sum = 0;
  for (let i = 0; i < 10000; i++) {
    for (let i = 0; i < 10000; i++) {
      sum += Math.random();
    }
  }
  let end = performance.now();
  let totolTime = end - start;
  // 得到该函数的计算用时
  console.log(totolTime, "totolTime");
}

let tasks = [
  () => {
    calc();
    console.log(1);
  },
  () => {
    calc();
    console.log(2);
  },
  () => {
    console.log(3);
  },
];

let work = (deadline: { timeRemaining: () => number; didTimeout: any }) => {
  console.log(`此帧的剩余时间为: ${deadline.timeRemaining()}`);

  // 如果此帧剩余时间大于0或者已经到了定义的超时时间（上文定义了timeout时间为1000，到达时间时必须强制执行），且当时存在任务，则直接执行这个任务
  // 如果没有剩余时间，则应该放弃执行任务控制权，把执行权交还给浏览器
  while (
    (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
    tasks.length > 0
  ) {
    let fn = tasks.shift() as Function;
    fn();
  }
  // 如果还有未完成的任务，继续调用requestIdleCallback申请下一个时间片
  if (tasks.length > 0) {
    window.requestIdleCallback(work, { timeout: 500 });
  }
};
window.requestIdleCallback(work, { timeout: 500 });
