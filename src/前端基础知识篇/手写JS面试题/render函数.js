/**
 * render 函数
   虚拟 dom 转化为真实 dom
 */

// 虚拟dom转化为真实dom
function render(node) {
  if (typeof node === "string") {
    // 创建文本节点
    return document.createTextNode(node);
  }
  // 创建对应的dom节点
  let dom = document.createElement(node.tag);
  if (node.attrs) {
    // 设置dom属性
    Object.keys(node.attrs).forEach((key) => {
      dom.setAttribute(key, node.attrs[key]);
    });
  }
  // 递归生成子节点
  if (node.children) {
    node.children.forEach((item) => {
      dom.appendChild(render(item));
    });
  }
  return dom;
}
