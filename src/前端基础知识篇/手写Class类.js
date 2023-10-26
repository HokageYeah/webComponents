// Child 为子类的构造函数， Parent为父类的构造函数
function selfClass(Child, Parent) {
  // Object.create 第二个参数，给生成的对象定义属性和属性描述符/访问器描述符
  Child.prototype = Object.create(Parent.prototype, {
    // 子类继承父类原型上的属性和方法
    constructor: {
      enumerable: false,
      configurable: false,
      writable: true,
      value: Child,
    },
  });
  console.log('Child.prototype----', Child.prototype);
  // 继承父类的静态属性和静态方法
  Object.setPrototypeOf(Child, Parent);
  console.log('Child.setPrototypeOf----', Child.prototype, Child);
}

// 测试
function Child() {
  this.name = 'HokageYeah';
}
function Parent() {}
// 设置父类的静态方法getInfo
Parent.getInfo = function () {
  console.log("info");
};
Parent.prototype.getName = function () {
  console.log('我是Parent的---');
  console.log(this.name);
};
selfClass(Child, Parent);
Child.getInfo(); // info
let tom = new Child();
tom.getName(); // 123
