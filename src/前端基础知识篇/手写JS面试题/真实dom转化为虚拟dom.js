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
