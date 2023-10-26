// 执行结果与`async、await`示例一致
const getData = () =>
  new Promise((resolve) => setTimeout(() => resolve("data"), 1000));

function* testG() {
  // await被编译成了yield
  const data = yield getData();
  console.log("data: ", data);
  const data2 = yield getData();
  console.log("data2: ", data2);
  return "success";
}
var gen = testG();
var dataPromise = gen.next();
dataPromise.value.then((value1) => {
  // data1的value被拿到了，继续调用next
  var data2Promise = gen.next(value1);
  data2Promise.value.then((value2) => {
    // data2的value拿到了 继续调用next并且传递value2
    gen.next(value2);
  });
});


// async、await 示例
// const getData = () =>
//   new Promise((resolve) => setTimeout(() => resolve("data"), 1000));
// async function test() {
//   const data = await getData();
//   console.log("data: ", data);
//   const data2 = await getData();
//   console.log("data2: ", data2);
//   return "success";
// }
// test().then((res) => console.log(res));
