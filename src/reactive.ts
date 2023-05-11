import { track, trigger } from "./effectTrackTrigger";
const isObject = (target: object) =>
  target != null && typeof target == "object";
export const reactive = <T extends object>(target: T): object => {
  return new Proxy(target, {
    get(target, key, receiver) {
      const getres = Reflect.get(target, key, receiver) as object;
      // 收集依赖
      track(target, key);
      //   对象类型监听深层次的
      if (isObject(getres)) {
        return reactive(getres);
      }
      return getres;
    },

    set(target, key, value, receiver) {
      const isset = Reflect.set(target, key, value, receiver);
      // 执行依赖
      trigger(target, key);
      return isset;
    },
  });
};

const obj = {
  a: "1",
};
const pro = new Proxy(obj, {
  get(target, key, receiver) {
    console.log("获取方法调用:", target, key, receiver);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log("设置方法调用:", target, key, value, receiver);
    return Reflect.set(target, key, value, receiver);
  },
});

console.log(pro.a);
pro.a = "3";
