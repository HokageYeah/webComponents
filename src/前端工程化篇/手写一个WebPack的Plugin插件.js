/**
 * 
 * compiler 上暴露的一些常用的钩子简介

钩子	类型	调用时机
run	AsyncSeriesHook	在编译器开始读取记录前执行
compile	SyncHook	在一个新的 compilation 创建之前执行
compilation	SyncHook	在一次 compilation 创建后执行插件
make	AsyncParallelHook	完成一次编译之前执行
emit	AsyncSeriesHook	在生成文件到 output 目录之前执行，回调参数： compilation
afterEmit	AsyncSeriesHook	在生成文件到 output 目录之后执行
assetEmitted	AsyncSeriesHook	生成文件的时候执行，提供访问产出文件信息的入口，回调参数：file，info
done	AsyncSeriesHook	一次编译完成后执行，回调参数：stats
 */

/**
 * 
 * 常用的 Plugin 插件
 * 
 * 插件名称	作用
html-webpack-plugin	生成 html 文件,引入公共的 js 和 css 资源
webpack-bundle-analyzer	对打包后的文件进行分析，生成资源分析图
terser-webpack-plugin	代码压缩，移除 console.log 打印等
HappyPack Plugin	开启多线程打包，提升打包速度
Dllplugin	动态链接库，将项目中依赖的三方模块抽离出来，单独打包
DllReferencePlugin	配合 Dllplugin，通过 manifest.json 映射到相关的依赖上去
clean-webpack-plugin	清理上一次项目生成的文件
vue-skeleton-webpack-plugin	vue 项目实现骨架屏
 */

// 自定义一个名为MyPlugin插件，该插件在打包完成后，在控制台输出"打包已完成"
class MyPlugin {
  // 原型上需要定义apply 的方法
  apply(compiler) {
    // 通过compiler获取webpack内部的钩子
    compiler.hooks.done.tap("My Plugin", (compilation, cb) => {
      console.log("打包已完成");
      // 分为同步和异步的钩子，异步钩子必须执行对应的回调
      cb();
    });
  }
}
module.exports = MyPlugin;
