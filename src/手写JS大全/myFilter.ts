(<any>Array.prototype).myFilter = function (this: Array<any>, fn, content) {
  if (this === null || this === undefined) {
    throw new TypeError("Cannot read property 'filter' of null or undefined");
  }
  // 处理回调类型异常
  if (Object.prototype.toString.call(fn) != "[object Function]") {
    throw new TypeError(`${fn} is not a function`);
  }
  let ary = this.slice();
  let list = new Array();
  for (let i = 0; i < ary.length; i++) {
    if (fn.call(content, ary[i], i, ary)) {
      list.push(ary[i]);
    }
  }
  return list;
};

let filterAry = [1, 2, 3, 4, 5];
console.log((filterAry as any).myFilter((item) => item > 3));
