"use strict";
class Elementhh {
    constructor(tagName, props, children) {
        this.tagName = tagName;
        this.props = props;
        this.children = children;
    }
    // 创建一个渲染函数
    render() {
        const el = document.createElement(this.tagName);
        Object.keys(this.props).forEach((propName) => {
            el.setAttribute(propName, this.props[propName]);
        });
        this.children.forEach((element) => {
            let childEl;
            if (element instanceof Elementhh) {
                childEl = element.render();
            }
            else {
                childEl = document.createTextNode(element);
            }
            el.appendChild(childEl);
        });
        return el;
    }
}
function createElement(tagName, props, ...children) {
    return new Elementhh(tagName, props, children);
}
function render(el, target) {
    const elRender = el.render();
    debugger;
    target.appendChild(el.render());
}
const childdom = createElement("span", { id: "app", style: "height:50px;width:50px;background:yellow" }, "我是子页面!");
const vdom = createElement("div", { id: "app", style: "height:300px;width:200px;background:red" }, "Hello, world!");
render(vdom, document.getElementById("root"));
