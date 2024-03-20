let obj = {
    max: 5,
    current: 0,
    //   生成器
    [Symbol.iterator]() {
        return {
            max: this.max,
            current: this.current,
            next() {
                if (this.max == this.current) {
                    return {
                        value: undefined,
                        done: true,
                    };
                }
                else {
                    return {
                        value: this.current++,
                        done: false,
                    };
                }
            },
        };
    },
};
let obj2 = {
    name: 'yy',
    age: 12
};
let obj3 = [1, 2, 3];
console.log(typeof obj2, typeof obj3);
for (const iterator of obj) {
    console.log(iterator);
}
console.log([...obj]);
