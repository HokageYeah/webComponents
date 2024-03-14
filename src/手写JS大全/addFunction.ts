// 题目描述:实现一个 add 方法 使计算结果能够满足如下预期： add(1)(2)(3)()=6 add(1,2,3)(4)()=10

const add = (...args: any[]) => {
  let allArgs = [...args];
  const fn = (...newArgs: any[]) => {
    allArgs = [...allArgs, ...newArgs];
    console.log(allArgs);
    return fn;
  };
  fn.toString = () => {
    console.log("tostring123");
    return allArgs.reduce((sum, cur) => sum + cur);
  };
  return fn;
};
// 题目描述:实现一个 add 方法 使计算结果能够满足如下预期： add(1)(2)(3)()=6 add(1,2,3)(4)()=10
// const add1 = (...args: any[]) => {
//     let allArgs = [...args];
//     const fn = (...newArgs: any[]) => {
//         allArgs = [...allArgs, ...newArgs];
//         console.log(allArgs);
//         return fn;
//     }
//     fn.toString = () => allArgs.reduce((pre, cur) => pre + cur);
//     return fn;
// }
const a1 = add(1)(2)(3)();
const a2 = add(1, 2, 3)(4)();
console.log("测试", a1.toString());
console.log("测试", a2.toString());
