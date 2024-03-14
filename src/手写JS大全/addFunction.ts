// 题目描述:实现一个 add 方法 使计算结果能够满足如下预期： add(1)(2)(3)()=6 add(1,2,3)(4)()=10

const add = (...args: any[]) => {
    let allArgs = [...args];
    const fn = (...newArgs: any[]) => {
        allArgs = [...allArgs, ...newArgs];
        console.log(allArgs);
        return fn;
    }
    return fn;
}
console.log(add(1)(2));
