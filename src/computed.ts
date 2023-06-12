import { effect } from './effectTrackTrigger.js'

export const computed = (getter: Function) => {
    debugger
    let _value = effect(getter, {
        // 依赖发生变化的时候会执行该函数更改_dirty，从而重新计算
        scheduler: ()=> {_dirty = true}
    })
    let catchValue: any
    // 添加缓存
    let _dirty = true
    class ComputedRefImpl {
        get value() {
            if(_dirty) {
                // 脏值检测
                catchValue = _value()
                _dirty = false
            }
            return catchValue
        }
    }
    return new ComputedRefImpl()
}