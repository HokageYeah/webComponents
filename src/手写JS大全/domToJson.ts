// 将真实dom转化为虚拟dom
function domToJson(node) {
  let obj: any = {};
  obj.nodeName = node.nodeName;
  obj.nodeType = node.nodeType;
  if (node.attributes && node.attributes.length) {
    obj.attributes = {};
    for (let i = 0; i < node.attributes.length; i++) {
      let attr = node.attributes[i];
      obj.attributes[attr.nodeName] = attr.nodeValue;
    }
  }
  if (node.childNodes && node.childNodes.length) {
    obj.childNodes = [];
    for (let i = 0; i < node.childNodes.length; i++) {
      let child = node.childNodes[i];
      // nodeType： 1 元素节点、3 文本节点
      if (child.nodeType == 1) {
        obj.childNodes.push(domToJson(child));
      } else if (child.nodeType == 3) {
        obj.childNodes.push(child.nodeValue);
      }
    }
  }
  return obj;
}
