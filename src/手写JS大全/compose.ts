// 用法如下:
function fn1(x: number) {
    return x + 1;
  }
  function fn2(x: number) {
    return x * 2;
  }
  function fn3(x: number) {
    return x + 3;
  }
  function fn4(x: number) {
    return x + 4;
  }
  const ad: any = compose(fn3, fn2, fn1);
  console.log(fn4(fn3(fn2(fn1(1)))))
  console.log(ad(1)); // 1+4+3+2+1=11

function compose(...fns: any) {
  return fns.reduce((pre, cur) => {
    console.log(pre, cur)
    return  (...args) => {
      console.log('---', ...args);
      return pre(cur(...args))
    } 
  });
}
  
  
// const numbers = [1, 2, 3, 4, 5];

// // 使用 reduce 方法对数组中的元素求和
// const sum = numbers.reduce((accumulator, currentValue) => {
//     console.log(accumulator, currentValue)
//  return accumulator + currentValue   
// });
// console.log(sum); // 输出结果为 15