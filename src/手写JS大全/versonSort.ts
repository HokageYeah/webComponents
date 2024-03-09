/**
 * 
  题目描述:有一组版本号如下['0.1.1', '2.3.3', '0.302.1', '4.2', '4.3.5', '4.3.4.5']。现在需要对其进行排序，排序的结果为 ['4.3.5','4.3.4.5','2.3.3','0.302.1','0.1.1']
 */

const versonAry = [
  "0.1.1",
  "2.3.3",
  '0.1',
  '1.2',
  "0.302.1",
  "4.2",
  "4.3.5",
  "4.3.4.5",
  "4.3.4.5.6",
  "1.3.4.5",
  "5.2",
];

const versonSortFn = (ary: string[]) => {
  ary.sort((a, b) => {
    const arr1 = a.split(".");
    const arr2 = b.split(".");
    console.log(arr1, arr2);
    for (let i = 0; i < arr1.length; i++) {
      const a1 = arr1[i] || 0;
      const b1 = arr2[i] || 0;
      console.log(a1, b1);
      if (a1 !== b1) return +b1 - +a1;
    }
    return 1;
  });
};
versonSortFn(versonAry);
console.log(versonAry);
