<div align="center">
    <h1>前端面试题（初级）</h1>
</div>

> ## JavaScript
### 1、JavaScript有哪些数据类型，他们的区别？如果提到原始数据类型和引用数据类型的话，追问数据类型的检测方式有哪些？
### 2、JavaScript如何进行隐式类型转换？对象转原始类型如何转换？
### 3、浅拷贝和深拷贝的区别是什么？如何实现深拷贝、如何实现浅拷贝？（如果回答了JSON.parse(JSON.stringify(object))解决深拷贝，追问它存在的问题）
### 4、箭头函数和普通函数的区别？箭头函数的特点？ 如果new一个箭头函数会怎么样？（追问new操作符的实现步骤）
### 5、什么对象能够使用for of遍历？（重点Symbol.iterator）for in 和for of的区别？
### 6、JavaScript脚本为什么要放在文档底部执行？JavaScript脚本延迟加载的方式有哪些？
### 7、说一下js数组方法有哪些， 哪些不会改变数组？哪些会改变数组？
### 8、use strict严格模式下运行JavaScript脚本，会带来什么影响？
### 9、异步编程的实现方式有哪些？Promise的状态有哪些？说出常用的Promise的方法？如果提到（all、race提出两者如何使用）
### 10、对async/await的理解、特点？以及对Promise的优势？
### 11、Event Loop是什么？微任务、宏任务都有哪些？以及他们的执行规则？（加分：对Node中的Event Loop了解吗？如何执行的？（6个阶段））

> ## vue
### 1、vue2的生命周期钩子函数都有哪些？与vue3有和区别？
### 2、computed和watch的区别？以及他们的应用场景？
### 3、如何保存页面的当前状态？keep-alive的理解以及它的缓存策略是什么？
### 4、v-if和v-show的区别？v-if和v-for的优先级？
### 5、v-model是如何实现的？如何在自定义组件上实现状态的双向绑定？
### 6、vue中的数据源频繁变化后，dom会更新几次？为什么这么设计？这个时候操作dom带来什么问题？如何解决？
### 7、vue中的nextTick 为什么要优先使用微任务实现？（Promise > MutationObserver > setImmediate > setTimeout ）
### 8、spa应用 vue中的组件如何做样式隔离的？回答了 scoped，追问 scoped的原理是什么？如果样式没有命中vue中如何解决？
### 9、vue3对比vue2 diff算法有什么区别或者说算法优化了什么？（加分：最长递增子序列如何实现的）
### 10、vue2中给data中新增属性或者通过下标去更改数组中的属性，试图会变化吗？为什么？如果不变化vue是如何解决的？
### 11、vue中的路由有哪几种模式？区别是什么？history模式中如果使用params传参，如何避免在手段刷新页面后参数消失的问题？hash的query传参有这个问题吗？（参数是拼接在连接后面的）query要用path来引入、params要用name来引入。
### 12、shallowReactive 与shallowRef、readonly 与 shallowReadonly、toRaw 与 markRaw、 unref、provide与inject、toRef
### 13、加分项目：vue3.3新增了哪些新特性？

> ## React
### 1、React Hook的使用有哪些限制？ 为什么？
### 2、如何判断React类组件什么时候重新渲染？shouldComponentUpdate是如何比较的（浅层比较）？
### 3、React类组件的声明周期有哪些？函数组件对应声明周期的hooks是什么？
### 4、React如何解决props层级过深的问题？
### 5、为什么usestate hooks要是用数组而不是对象？（降低使用的复杂度、返回数组可以直接解构，使用多次不需要重新定义别名）