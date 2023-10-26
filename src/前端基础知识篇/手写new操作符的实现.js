function objectFactory() {
  let newObject = null;
  let Constructor = Array.prototype.shift.call(arguments);
  if (typeof Constructor !== "function") {
    console.error("构造函数必须是函数");
    return;
  }
  // 新建一个空对象，对象的原型为构造函数的prototype对象
  newObject = Object.create(Constructor.prototype);
  // 执行构造函数 并且将this指向新对象
  let result = Constructor.apply(newObject, arguments);
  let flag =
    result && (typeof result === "object" || typeof result === "function");
  return flag ? result : newObject;
}

function test() {
  this.name = "测试";
  console.log(this.name, arguments);
}
// 使用方法
objectFactory(test, 1, 2);
