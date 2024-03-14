// Object.is不会转换被比较的两个值的类型，这点和===更为相似，他们之间也存在一些区别。
//     1. NaN在===中是不相等的，而在Object.is中是相等的
//     2. +0和-0在===中是相等的，而在Object.is中是不相等的

const objectIS = (x: any, y: any) => {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  }
  return x !== x && y !== y;
};

console.log(objectIS(+0, -0));
console.log(objectIS(NaN, NaN));
console.log(objectIS(1, 1));
console.log(objectIS(1, "1"));
