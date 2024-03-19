/**
 * 
const obj = {
 a: {
        b: 1,
        c: 2,
        d: {e: 5}
    },
 b: [1, 3, {a: 2, b: 3}],
 c: 3
}

flatten(obj) 结果返回如下
// {
//  'a.b': 1,
//  'a.c': 2,
//  'a.d.e': 5,
//  'b[0]': 1,
//  'b[1]': 3,
//  'b[2].a': 2,
//  'b[2].b': 3
//   c: 3
// }

 */

const obj1 = {
  a: {
    b: 1,
    c: 2,
    d: { e: 5 },
  },
  b: [1, 3, { a: 2, b: 3 }],
  c: 3,
};

const isObj = (value: any) => {
  return typeof value === "object" && value !== null;
};
const flatten = (obj: any) => {
  let map: any = {};
  const dns = (item: any, key: string) => {
    if (isObj(item)) {
      if (Array.isArray(item)) {
        item.forEach((element, index) => {
          dns(element, `${key}[${index}]`);
        });
      } else {
        for (let keyin in item) {
          dns(item[keyin], `${key}${key ? "." : ""}${keyin}`);
        }
      }
    } else {
      map[key] = item;
    }
  };
  dns(obj, "");
  return map;
};
console.log(isObj(null));
console.log(Object.prototype.toString.call(null));
console.log(flatten(obj1));

const flatten2 = (obj: any) => {
  const map: any = {};
  const dns = (item: any, key: string) => {
    if (isObj(item)) {
      if (item instanceof Array) {
        item.forEach((element, index) => {
          dns(element, `${key}[${index}]`);
        });
      } else {
        for (let keyin in item) {
          dns(item[keyin], `${key}${key ? "." : ""}${keyin}`);
        }
      }
    } else {
      map[key] = item;
    }
  };
  dns(obj, "");
  return map
};

console.log("查看flatten2：", flatten2(obj1));
