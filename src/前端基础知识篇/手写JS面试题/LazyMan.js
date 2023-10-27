/**
 * LazyMan
    考察：事件轮询机制、链式调用、队列
 */

class LazyMan {
  constructor(name) {
    this.name = name;
    this.task = []; // 任务列表
    function fn() {
      console.log("hi" + this.name);
      this.next();
    }
    this.task.push(fn);
    // 重点：使用setTimeout宏任务，确保所有的任务都注册到task列表中
    setTimeout(() => {
      this.next();
    });
  }
  next() {
    // 取出第一个任务并执行
    let fn = this.task.shift();
    fn && fn.call(this);
  }
  sleepFirst(time) {
    function fn() {
      console.log("sleepFirst" + time);
      setTimeout(() => {
        this.next();
      }, time);
    }
    // 插入到第一个
    this.task.unshift(fn);
    // 返回this 可以链式调用
    return this;
  }
  sleep(time) {
    function fn() {
      console.log("sleep" + time);
      setTimeout(() => {
        this.next();
      }, time);
    }
    this.task.push(fn);
    return this;
  }
  eat(something) {
    function fn() {
      console.log("eat" + something);
      this.next();
    }
    this.task.push(fn);
    return this;
  }
}

new LazyMan("王").sleepFirst(3000).eat("breakfast").sleep(3000).eat("dinner");
