// 数组扁平化
// console.log(flatter([1, 2, [1, [2, 3, [4, 5, [6]]]]]));

const ary = [1, 2, [1, [2, 3, [4, 5, [6]]]]];

const flatter = (ary: any[]) => {
  while (
    ary.some((item: any) => {
      console.log("isary---", item);
      return Array.isArray(item);
    })
  ) {
    console.log("---", ary);
    ary = [].concat(...ary);
    console.log(ary);
  }
  // console.log(ary);
};

const flatterReduce = (ary: any[]) => {
  const flatterAry: any = ary.reduce((pre, cur) => {
    // console.log("===", pre);
    return Array.isArray(cur) ? [...pre, ...flatterReduce(cur)] : [...pre, cur];
  }, []);
  console.log(ary);
  return flatterAry;
};

console.log(flatterReduce(ary));
// flatter(ary);

const ary1 = [1, 2, [1, [2, 3, [4, 5, [6]]]]];
const flatterReduce2 = (args: any[]): any => {
  return args.reduce((pre, cur) => {
    return Array.isArray(cur) ? [...pre, ...flatterReduce2(cur)] : [...pre, cur];
  }, []);
};
console.log('ddd', flatterReduce2(ary1));
