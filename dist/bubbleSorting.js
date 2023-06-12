"use strict";
const arr = [911, 520, 888, 444, 666, 234];
// 冒泡排序
function bubbleSort(arr) {
    let temp;
    for (let i = 0; i < arr.length - 1; i++) {
        for (let index = 0; index < arr.length - 1 - i; index++) {
            if (arr[index] > arr[index + 1]) {
                temp = arr[index];
                arr[index] = arr[index + 1];
                arr[index + 1] = temp;
            }
            const element = arr[index];
        }
    }
    return arr;
}
console.log(bubbleSort(arr));
let ws = new WebSocket('ws://localhost:9999');
ws.binaryType = 'arraybuffer';
// 函数柯力化 
const nameList1 = [
    { mid: "阿萨德", profession: "中单" },
    { mid: "沙皇", profession: "中单" },
    { mid: "卡牌", profession: "中单" },
    { mid: "发条", profession: "中单" },
];
const nameList2 = [
    { adc: "女警", profession: "adc" },
    { adc: "轮子妈", profession: "adc" },
    { adc: "老鼠", profession: "adc" },
];
const curring = (name) => {
    return (element) => {
        return element[name];
    };
};
// const curring = (name: string) => (element: { [x: string]: any; }) => element[name]
const a = curring('mid');
debugger;
console.log(a);
console.log(nameList1.map(a));
