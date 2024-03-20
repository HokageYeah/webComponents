class Btn extends HTMLElement {
    constructor() {
        super();
        const shaDow = this.attachShadow({ mode: "open" });
        this.p = this.h("p");
        this.p.innerText = "余晔1时尚23";
        this.p.setAttribute("style", "height:200px;width:300px;border:1px solid #ccc;background:yellow'");
        shaDow.appendChild(this.p);
    }
    // 渲染函数
    h(el) {
        return document.createElement(el);
    }
    /**
     * 生命周期
     */
    //当自定义元素第一次被连接到文档 DOM 时被调用。
    connectedCallback() {
        console.log("我已经插入了！！！嗷呜2222 ");
    }
    //当自定义元素与文档 DOM 断开连接时被调用。
    disconnectedCallback() {
        console.log("我已经断开了！！！嗷呜");
    }
    //当自定义元素被移动到新文档时被调用
    adoptedCallback() {
        console.log("我被移动了！！！嗷呜");
    }
    //当自定义元素的一个属性被增加、移除或更改时被调用
    attributeChangedCallback() {
        console.log("我被改变了！！！嗷呜");
    }
}
window.customElements.define("yuye-man", Btn);
const ab = {
    b: 2,
    foo: function () {
        console.log('哈哈哈哈');
        console.log(this.b);
    }
};
function b(foo) {
    foo();
}
ab.foo();
b(ab.foo);
