(Array.prototype as any).mySome = function (this: Array<any>, fn, content) {
  console.log(this, fn, content);
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'map' of null or undefined");
  }
  if (Object.prototype.toString.call(fn) !== "[object Function]") {
    throw new TypeError(fn + " is not a function");
  }
  const arr = this.slice();
  for (let i = 0; i < arr.length; i++) {
    console.log("D");
    if (fn.call(content, arr[i], i, arr)) {
      return true;
    }
  }
  return false;
};

let someArr = [1, 2, 3, 4, 5, 6];
console.log((someArr as any).mySome((item) => item > 2)); // [2, 4, 6]
