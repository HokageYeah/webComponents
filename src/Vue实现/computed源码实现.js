// 空函数
const noop = () => {};
// computed初始化的Watcher传入lazy: true，就会触发Watcher中的dirty值为true
const computedWatcherOptions = { lazy: true };
//Object.defineProperty 默认value参数
const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};
// 初始化computed
class initComputed {
  constructor(vm, computed) {
    //新建存储watcher对象，挂载在vm对象执行
    const watchers = (vm._computedWatchers = Object.create(null));
    // 遍历computed
    for (const key in computed) {
      const userDef = computed[key];
      //getter值为computed中key的监听函数或对象的get值
      let getter = typeof userDef === 'function' ? userDef : userDef.get;
      // 新建computed watcher
      watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);
      if (!(key in vm)) {
        // 定义计算属性
        this.defineComputed(vm, key, userDef);
      }
    }
  }

  // 重新定义计算属性  对get和set劫持
  // 利用Object.defineProperty来对计算属性的get和set进行劫持
  defineComputed(target, key, userDef) {
    // 如果是一个函数，需要手动赋值到get上
    if (typeof userDef === 'function') {
      sharedPropertyDefinition.get = this.createComputedGetter(key);
      sharedPropertyDefinition.set = noop;
    } else {
      sharedPropertyDefinition.get = userDef.get
        ? userDef.cache !== false
          ? this.createComputedGetter(key)
          : userDef.get
        : noop;
      // 如果有设置set方法则直接使用，否则赋值空函数
      sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
    }
    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  // 计算属性的getter 获取计算属性的值时会调用
  createComputedGetter(key) {
    return function computedGetter() {
      // 获取对应的计算属性watcher
      const watcher = this._computedWatchers && this._computedWatchers[key];
      if (watcher) {
        // dirty为true,计算属性需要重新计算
        if (watcher.dirty) {
          watcher.evaluate();
        }
        // 获取依赖
        if (Dep.target) {
          watcher.depend();
        }
        //返回计算属性的值
        return watcher.value;
      }
    };
  }
}