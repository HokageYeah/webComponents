// 通过Object.prototype.toString.call实现

function getDataType(target) {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}
// 判断所有的数据类型
console.log(getDataType(null)); // null
console.log(getDataType(undefined)); // undefined
console.log(getDataType(Symbol())); // symbol
console.log(getDataType(new Date())); // date
console.log(getDataType(new Set())); // set
