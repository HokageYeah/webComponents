
/**
 * 
 * 常用的 loader
名称	作用
style-loader	用于将 css 编译完成的样式，挂载到页面 style 标签上
css-loader	用于识别 .css 文件, 须配合 style-loader 共同使用
sass-loader/less-loader	css 预处理器
postcss-loader	用于补充 css 样式各种浏览器内核前缀
url-loader	处理图片类型资源，可以转 base64
vue-loader	用于编译 .vue 文件
worker-loader	通过内联 loader 的方式使用 web worker 功能
style-resources-loader	全局引用对应的 css，避免页面再分别引入
 * 
 */


// 作用：将css内容，通过style标签插入到页面中
// source为要处理的css源文件
function loader(source) {
  let style = `
      let style = document.createElement('style');
      style.setAttribute("type", "text/css");
      style.innerHTML = ${source};
      document.head.appendChild(style)`;
  return style;
}
module.exports = loader;
