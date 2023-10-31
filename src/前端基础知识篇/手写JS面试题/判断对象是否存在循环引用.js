// 循环引用对象本来没有什么问题，但是序列化的时候就会发生问题。
// 比如调用JSON.stringify()对该类对象进行序列化，就会报错。

// 判断对象是否存在循环引用
function isCycleObject(obj, parent) {
  const parentArr = parent || [obj];
  for (let i in obj) {
    if (typeof obj[i] === "object") {
      let flag = false;
      parentArr.forEach((element) => {
        if (element === obj[i]) {
          flag = true;
        }
      });
      if (flag) return true;
      flag = isCycleObject(obj[i], [...parentArr, obj[i]]);
      if (flag) return true;
    }
  }
  return false;
}

const a = 1;
const b = { a };
const c = { b };
const o = { d: { a: 3 }, c };
o.c.b.aa = a;
console.log(b);
console.log(c);
console.log(o);
console.log(isCycleObject(o));
