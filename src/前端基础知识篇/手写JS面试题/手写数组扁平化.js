// deep初始值为1
Array.prototype.myFlat = function (deep = 1) {
  let arr = this;
  // deep为0则返回，递归结束
  if (deep == 0) return arr;
  // 使用reduce作为累加器
  return arr.reduce((pre, cur) => {
    // cur为数组，继续递归，deep-1
    if (Array.isArray(cur)) {
      return [...pre, ...cur.myFlat(deep - 1)];
    } else {
      return [...pre, cur];
    }
  }, []);
};
console.log([1, 2, 3, [4, [5, [6]]]].myFlat(2)); // [1, 2, 3, 4, 5, [6]]
