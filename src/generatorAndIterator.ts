interface objType {
  bear: Array<string>;
  [Symbol.iterator]: () => Iterator<string>;
}
const objYY: objType = {
  bear: ["唱", "跳", "RAP", "篮球"],
  [Symbol.iterator]: function () {
    let index = 0;
    let _iterator = {
      next: (): IteratorResult<string> => {
        if (index < this.bear.length) {
          return { done: false, value: this.bear[index++] };
        }
        return { done: true, value: undefined };
      },
    };
    return _iterator;
  },
};
for (const iterator of objYY) {
  console.log(iterator);
}


let index = 0
const bears: string[] = ['ice', 'panda', 'grizzly']

let iterator = {
  next() {
    if (index < bears.length) {
      return { done: false, value: bears[index++] }
    }

    return { done: true, value: undefined }
  }
}
console.log(iterator.next())