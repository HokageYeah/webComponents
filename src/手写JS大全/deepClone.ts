// var obj1 = {
// a:1,
// b:{a:2}
// };
// var obj2 = deepClone(obj1);
// console.log(obj1);

const isObject = (obj: any) => {
  return typeof obj === "object" && obj !== null;
};

const deepClone = (obj: any) => {
  if (!isObject(obj)) return obj;
  let newObj: any = Array.isArray(obj) ? [] : {};
  Reflect.ownKeys(obj).forEach((key) => {
    if (isObject(obj[key])) {
      newObj[key] = deepClone(obj[key]);
    } else {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

let objdep1 = {
  a: 1,
  b: { a: 2 },
  c: [1, 2, 3],
};
let objdep2 = deepClone(objdep1);
objdep2.a = 2;
objdep2.b.a = 3;
objdep2.c[0] = 4;
console.log(objdep2);
console.log(objdep1);
