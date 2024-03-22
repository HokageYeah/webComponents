// 手写寄生组合式继承

// 精简版
class Child {
  constructor() {
    // 调用父类的构造函数
    Parent.call(this);
    // 利用Object.create生成一个对象，新生成对象的原型是父类的原型，并将该对象作为子类构造函数的原型，继承了父类原型上的属性和方法
    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
  }
}

// 通用版本
function Parent(name) {
  this.name = name;
}
Parent.prototype.getName = function () {
  console.log(this.name);
};
function Child2(name, age) {
  Parent.call(this, name);
  this.age = age;
}
Child2.prototype = Object.create(Parent.prototype);
Child2.prototype.constructor = Child2;
let child = new Child2("傻逼", 22);
// console.log(child);
// console.log(child.__proto__);
// console.log(Child2.prototype);
child.getName();

// 手写class类
// ES6 的 Class 内部是基于寄生组合式继承，它是目前最理想的继承方式
// ES6 的 Class 允许子类继承父类的静态方法和静态属性
function selfClass(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype, {
    constructor: {
      value: Child,
      enumerable: false,
      writable: true,
      configurable: false,
    },
  });
  // console.log("Child-----Parent-", Parent.prototype)
  // console.log('Child-----', Child);
  debugger;
  console.dir(Child.prototype);
  console.dir(Child);
  console.dir(Child.getInfo);
  // 打印出来的是子类的构造函数
  // 继承父类的静态属性和静态方法
  // Object.setPrototypeOf(obj, proto);
  // 参数
  // obj：要设置原型对象的对象。
  // proto：该对象的新原型对象或null，否则抛出TypeError异常。
  Object.setPrototypeOf(Child, Parent);
  console.dir(Child.prototype);
  console.dir(Child.__proto__);
  console.dir(Child);
  console.dir(Child.getInfo);
  // console.log('Child2-----', Child);
}
// 测试
function Child3() {
  this.name = 123456;
}
function Parent3() {}

Parent3.getInfo = function () {
    console.log(this.name, 'info');
}
Parent3.prototype.getName = function () {
    console.log(this.name, 'name');
}
selfClass(Child3, Parent3);
(Child3 as any).getInfo();
let tom = new Child3();
tom.getName();
