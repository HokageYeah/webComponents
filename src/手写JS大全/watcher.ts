// 观察者模式
let data = {
  name: "lisi",
  age: 18,
};

Object.keys(data).forEach((key) => {
  let value = data[key];
  Object.defineProperty(data, key, {
    get() {
      console.log("get", key);
      return value;
    },
    set(newValue) {
      console.log("set", key);
      value = newValue;
    },
  });
});
data.name = "HokageYeah";
console.log(data.name);
