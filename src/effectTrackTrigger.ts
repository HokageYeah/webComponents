let activeEffect: () => void;
// 新增一个调度
interface Options {
  scheduler? :Function
}
// 实现一个副作用函数
export const effect = (fu: Function, options: Options) => {
  const _effect = function () {
    activeEffect = _effect;
    let res = fu();
    return res
  };
  _effect.option = options
  _effect();
  return _effect
};

// track方法收集依赖， 保存key和effect的关系
const targetMap = new WeakMap();
export const track = (target: object, key: string | symbol) => {
  if (!activeEffect) return;
  // 从缓存中找到target 对象所有的依赖信息，如果没有则创建一个map
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // 在找到key所对应的_effect集合
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  // 如果effect 已经被收集过，则不再收集
  let sholdTrack = deps.has(activeEffect);
  if (!sholdTrack) {
    deps.add(activeEffect);
  }
};

// 实现trigger的依赖派发
export const trigger = (target: object, key: string | symbol) => {
  // 根据target找到依赖
  let depsMap = targetMap.get(target);
  if (!depsMap) return;
  // 找到属性依赖_effect列表
  let effects = depsMap.get(key);
  if (effects) {
    effects.forEach((effect: any) => {
      if(effect?.option?.scheduler) {
        // 如果传递过来的有这个scheduler 则调用
        effect?.option?.scheduler?.()
      }else{
        // 否则派发依赖
        effect();
      }
    });
  }
};
