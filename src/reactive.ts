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
