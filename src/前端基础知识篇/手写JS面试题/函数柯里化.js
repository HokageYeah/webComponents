/**
 * 函数柯里化： 将使用多个参数的一个函数，转换成一系列使用一个参数的函数
 * 函数柯里化的原理： 用闭包把参数保存起来，当参数的长度等于原函数时，就开始执行原函数
 */

function mycurry(fn) {
  // fn.length 表示函数中参数的长度
  // 函数的length属性，表示形参的个数，不包含剩余参数，仅包括第一个有默认值之前的参数个数（不包含有默认值的参数）
  if (fn.length <= 1) return fn;
  console.log(fn.length);
  // 自定义generator迭代器
  const generator = (...args) => {
    // 判断已传的参数与函数定义的参数个数是否相等
    if (fn.length === args.length) {
      return fn(...args);
    } else {
      // 不相等，继续迭代
      return (...args1) => {
        return generator(...args, ...args1);
      };
    }
  };
  return generator;
}
function fn(a, b, c, d) {
  return a + b + c + d;
}
let fn1 = mycurry(fn);
console.log(fn1(1)(2)(3)(4)); // 10
