/**
 * 
实现一个LazyMan，可以按照以下方式调用:
LazyMan(“Hank”)输出:
Hi! This is Hank!

LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
Hi! This is Hank!
//等待10秒..
Wake up after 10
Eat dinner~

LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
Hi This is Hank!
Eat dinner~
Eat supper~

LazyMan(“Hank”).eat(“supper”).sleepFirst(5)输出
//等待5秒
Wake up after 5
Hi This is Hank!
Eat supper
 */

class _LazyMan {
  name: any;
  task: Function[];
  constructor(name: any) {
    this.name = name;
    this.task = [];
    const taskFun = () => {
      console.log(`Hi! This is ${this.name}`);
      this.nextFun();
    };
    this.task.push(taskFun);
    setTimeout(() => {
      this.nextFun();
    }, 0);
  }
  nextFun() {
    const task = this.task.shift();
    task && task();
  }
  eat(str: any) {
    const taskFun = () => {
      console.log(`Eat ${str}`);
      this.nextFun();
    };
    this.task.push(taskFun);
    return this;
  }
  sleep(time: number) {
    this._sleepWrapper(time, false);
    return this;
  }
  sleepFirst(time: number) {
    this._sleepWrapper(time, true);
    return this;
  }
  _sleepWrapper(time: number, first: boolean) {
    const taskFun = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this.nextFun();
      }, time * 1000);
    };
    if (first) {
      this.task.unshift(taskFun);
    } else {
      this.task.push(taskFun);
    }
  }
}

function LazyMan(name: any) {
  return new _LazyMan(name);
}

// LazyMan("Hank").eat("dinner").sleep(3).eat("supper");

// class _LazyMan {
//     tasks: Function[];
//     constructor(name: any) {
//       this.tasks = [];
//       const task = () => {
//         console.log(`Hi! This is ${name}`);
//         this.next();
//       };
//       this.tasks.push(task);
//       setTimeout(() => {
//         // 把 this.next() 放到调用栈清空之后执行
//         console.log('哈哈哈', this.tasks);
//         this.next();
//       }, 0);
//     }
//     next() {
//       const task = this.tasks.shift(); // 取第一个任务执行
//       task && task();
//     }
//     sleep(time: any) {
//       this._sleepWrapper(time, false);
//       return this; // 链式调用
//     }
//     sleepFirst(time: any) {
//       this._sleepWrapper(time, true);
//       return this;
//     }
//     _sleepWrapper(time: number, first: boolean) {
//       const task = () => {
//         setTimeout(() => {
//           console.log(`Wake up after ${time}`);
//           this.next();
//         }, time * 1000);
//       };
//       if (first) {
//         this.tasks.unshift(task); // 放到任务队列顶部
//       } else {
//         this.tasks.push(task); // 放到任务队列尾部
//       }
//     }
//     eat(name: any) {
//       const task = () => {
//         console.log(`Eat ${name}`);
//         this.next();
//       };
//       console.log('嘿嘿嘿', this.tasks);
//       this.tasks.push(task);
//       return this;
//     }
//   }
//   function LazyMan(name: any) {
//     return new _LazyMan(name);
//   }
//   LazyMan("Hank").eat('dinner');

class _LazyMan2 {
  name: any;
  tasks: any[];
  constructor(name: any) {
    this.name = name;
    this.tasks = [];
    const task = () => {
      console.log(`Hi! This is ${name}`);
      this.next();
    };
    this.tasks.push(task);
    setTimeout(() => {
      this.next();
    });
  }
  next() {
    const task = this.tasks.shift();
    task && task();
  }
  eat(name: string) {
    const task = () => {
      console.log(`Eat ${name}`);
      this.next();
    };
    this.tasks.push(task);
    return this;
  }
  _sleepWrapper(time: number, first: boolean) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${time}`);
        this.next();
      }, time * 1000);
    };
    if (first) {
      this.tasks.unshift(task);
    } else {
      this.tasks.push(task);
    }
  }
  sleepFirst(time: number) {
    this._sleepWrapper(time, true);
    return this;
  }
  sleep(time: number) {
    this._sleepWrapper(time, false);
    return this;
  }
}

function LazyMan2(name: any) {
  return new _LazyMan2(name);
}

LazyMan2("Hank23").eat("dinner23").sleep(3).eat("supper23").sleepFirst(2);
