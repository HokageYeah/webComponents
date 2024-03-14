// 用法如下：
// // function Person(name, age) {
// //   this.name = name;
// //   this.age = age;
// // }
// // Person.prototype.say = function() {
// //   console.log(this.age);
// // };
// // let p1 = myNew(Person, "lihua", 18);
// // console.log(p1.name);
// // console.log(p1);
// // p1.say();

const myNew = (fn: any, ...args: any[]) => {
  let newObj = null;
  if (typeof fn !== "function") {
    return;
  }
  newObj = Object.create(fn.prototype);
  let result = fn.apply(newObj, args);
  let flag =
    result && (typeof result === "object" || typeof result === "function");
  return flag ? result : newObj;
};
function Person(this: any, name: any, age: any) {
  this.name = name;
  this.age = age;
}
Person.prototype.say = function () {
  console.log(this.age);
};
let p1 = myNew(Person, "lihua", 18);
console.log(p1.name);
console.log(p1);
p1.say();
