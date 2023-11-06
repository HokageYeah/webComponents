/**
 * 
 * Webpack5 模块联邦
webpack5 模块联邦(Module Federation) 使 JavaScript 应用，得以从另一个 JavaScript 应用中动态的加载代码，实现共享依赖，用于前端的微服务化

比如项目A和项目B，公用项目C组件，以往这种情况，可以将 C 组件发布到 npm 上，然后 A 和 B 再具体引入。当 C 组件发生变化后，需要重新发布到 npm 上，A 和 B 也需要重新下载安装

使用模块联邦后，可以在远程模块的 Webpack 配置中，将 C 组件模块暴露出去，项目 A 和项目 B 就可以远程进行依赖引用。当 C 组件发生变化后，A 和 B 无需重新引用

模块联邦利用 webpack5 内置的ModuleFederationPlugin插件，实现了项目中间相互引用的按需热插拔

Webpack ModuleFederationPlugin
重要参数说明

1）name  当前应用名称，需要全局唯一

2）remotes  可以将其他项目的  name  映射到当前项目中

3）exposes  表示导出的模块，只有在此申明的模块才可以作为远程依赖被使用

4）shared  是非常重要的参数，制定了这个参数，可以让远程加载的模块对应依赖，改为使用本地项目的依赖，如 React 或 ReactDOM
 */

// https://github.com/xy-sea/blog/blob/main/markdown/%E3%80%8C%E5%8E%86%E6%97%B68%E4%B8%AA%E6%9C%88%E3%80%8D10%E4%B8%87%E5%AD%97%E5%89%8D%E7%AB%AF%E7%9F%A5%E8%AF%86%E4%BD%93%E7%B3%BB%E6%80%BB%E7%BB%93%EF%BC%88%E5%B7%A5%E7%A8%8B%E5%8C%96%E7%AF%87%EF%BC%89.md
// 配置示例

new ModuleFederationPlugin({
  name: "app_1",
  library: { type: "var", name: "app_1" },
  filename: "remoteEntry.js",
  remotes: {
    app_02: "app_02",
    app_03: "app_03",
  },
  exposes: {
    antd: "./src/antd",
    button: "./src/button",
  },
  shared: ["react", "react-dom"],
});
