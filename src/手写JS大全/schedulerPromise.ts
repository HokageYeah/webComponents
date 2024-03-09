/**
 * 
 * 
 addTask(1000,"1");
 addTask(500,"2");
 addTask(300,"3");
 addTask(400,"4");
 的输出顺序是：2 3 1 4

 整个的完整执行流程：

一开始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4
 */

import { promises } from "dns";

class Scheduler {
  maxCount: number;
  quere: Function[];
  count: number;
  constructor(max: number) {
    this.maxCount = max;
    this.count = 0;
    this.quere = [];
  }
  add(timer: number, order: string) {
    const fun = () => {
      return new Promise((resolve: any, reject: any) => {
        setTimeout(() => {
          console.log(order);
          resolve();
        }, timer);
      });
    };
    this.quere.push(fun);
    console.log(this.quere);
  }
  request() {
    if (!this.quere || this.quere.length == 0 || this.count >= this.maxCount)
      return;
    this.count++;
    (this.quere.shift() as Function)().then(() => {
      this.count--;
      this.request();
    });
  }
  startTask() {
    for (let i = 0; i < this.maxCount; i++) {
      this.request();
    }
  }
}

const sche = new Scheduler(2);

const addTask = (timer: number, order: string) => {
  sche.add(timer, order);
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
sche.startTask();



// class Scheduler {
//   queue: Function[];
//   maxCount: number;
//   runCounts: number;
//   constructor(limit: number) {
//     this.queue = [];
//     this.maxCount = limit;
//     this.runCounts = 0;
//   }
//   add(time: number | undefined, order: any) {
//     const promiseCreator = () => {
//       return new Promise<void>((resolve, reject) => {
//         setTimeout(() => {
//           console.log(order);
//           resolve();
//         }, time);
//       });
//     };
//     this.queue.push(promiseCreator);
//   }
//   taskStart() {
//     for (let i = 0; i < this.maxCount; i++) {
//       this.request();
//     }
//   }
//   request() {
//     if (!this.queue || !this.queue.length || this.runCounts >= this.maxCount) {
//       return;
//     }
//     this.runCounts++;
//     (this.queue.shift() as Function)().then(() => {
//       this.runCounts--;
//       this.request();
//     });
//   }
// }
// const scheduler = new Scheduler(2);
// const addTask = (time: number | undefined, order: string) => {
//   scheduler.add(time, order);
// };
// addTask(1000, "1");
// addTask(500, "2");
// addTask(300, "3");
// addTask(400, "4");
// scheduler.taskStart();
