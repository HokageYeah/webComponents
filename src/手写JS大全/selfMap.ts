(Array.prototype as any).selfMap = function (this: Array<any>, fn, content) {
  console.log(this, fn, content);
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  if (Object.prototype.toString.call(fn) !== "[object Function]") {
    throw new TypeError(fn + " is not a function");
  }
  const arr = this.slice();
  const listAry = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    listAry[i] = fn.call(content, arr[i], i, arr);
  }
  return listAry;
};

let selfArr = [1, 2, 3];
console.log((selfArr as any).selfMap((item) => item * 2)); // [2, 4, 6]
