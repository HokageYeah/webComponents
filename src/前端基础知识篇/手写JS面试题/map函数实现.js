/**
 * map 中的第二个参数作为第一个参数的 this
    注意：需要判断稀疏数组，跳过稀疏数组中的空值
    手写 map 函数
 */

Array.prototype.selfMap = function (fn, content) {
  // map中的第二个参数作为fn函数的this
  // Array.prototype.slice.call将类数组转化为数组，同Array.from, this为调用的数组（arr）
  let arr = Array.prototype.slice.call(this);
  let mappedArr = Array(); // 创建一个空数组
  for (let i = 0; i < arr.length; i++) {
    // 判断稀疏数组，跳过稀疏数组中的空值
    // 稀疏数组：数组中元素的个数小于数组的长度，比如Array(2) 长度为2的稀疏数组
    if (!arr.hasOwnProperty(i)) continue;
    mappedArr[i] = fn.call(content, arr[i]);
  }
  return mappedArr;
};
let arr = [1, 2, 3];
console.log(arr.selfMap((item) => item * 2)); // [2, 4, 6]
