// 将真实dom转化为虚拟dom
function dom2Json(dom) {
    if (!dom.tagName) return;
    let obj = {};
    obj.tag = dom.tagName;
    obj.children = [];
    dom.childNodes.forEach((item) => {
      // 去掉空的节点
      dom2Json(item) && obj.children.push(dom2Json(item));
    });
    return obj;
  }
  
  // 虚拟dom包含三个参数  type, props, children
  class Element {
    constructor(type, props, children) {
      this.type = type;
      this.props = props;
      this.children = children;
    }
  }
  
  // 将虚拟dom渲染成真实的dom
  function render(domObj) {
    let el = document.createElement(domObj.type);
    Object.keys(domObj.props).forEach((key) => {
      // 设置属性
      let value = domObj.props[key];
      switch (key) {
        case 'value':
          if (el.tagName == 'INPUT' || el.tagName == 'TEXTAREA') {
            el.value = value;
          } else {
            el.setAttribute(key, value);
          }
          break;
        case 'style':
          el.style.cssText = value;
          break;
        default:
          el.setAttribute(key, value);
      }
    });
    domObj.children.forEach((child) => {
      child = child instanceof Element ? render(child) : document.createTextNode(child);
    });
    return el;
  }