// 创建自动执行函数，给window上绑定类
(function () {
  "use strict";
  const body = document.querySelector("body");
  const html = document.querySelector("html");
  class YYDomInspector {
    constructor(options = {}) {
      debugger;
      this.status = "disable";
      this.xpath = null;
      this.target = "";
      this.mode = "single";
      this.event = "mousemove";
      this.maxZIndex = getMaxZIndex() + 1;
      this._throttleOnMove = throttle(this._onMove.bind(this), 3000);
      // 创建遮罩层
      this.overlay = createElement("div", {
        id: "dom-inspector-root",
        style: `z-index: ${this.maxZIndex}`,
      });
      // 创建辅助元素，用于判断圈选器元素是否被缩放
    }
    enable(mode = "single") {
      debugger;
      this.status = "enable";
      this.xpath = null;
      this.target = "";
      this.mode = mode;
      // 显示遮罩层
      this.overlay.style.display = "block";
      body &&
        body.addEventListener(this.event, this._throttleOnMove, {
          capture: true, //事件捕获
          passive: this.env === "mobile" ? false : true,
        });
      return null;
    }
    _onMove(e) {
      console.log("_onMove");
    }
  }
  // 新键创建元素方法
  function createElement(tag, attr, content) {
    const ele = window.document.createElement(tag);
    const keys = Object.keys(attr);
    keys.forEach((item) => {
      const value = attr[item];
      ele.setAttribute(item, value);
    });
    content && (ele.innerHTML = content);
    debugger;
    console.log(ele);
    return ele;
  }
  // 获取最大层级 zIndex
  function getMaxZIndex() {
    const elementAll = [...document.querySelectorAll("*")];
    const reduceNum = elementAll.reduce((r, e) => {
      // 获取每个元素的zIndex 找到最大的值
      const zIndex = window.getComputedStyle(e).zIndex;
      console.log("找到最大的zIndex", +zIndex);
      return Math.max(r, +zIndex || 0);
    }, 0);
    return reduceNum;
  }

  function throttle(func, wait = 100) {
    let timeout;
    let provious = 0;
    return function (...args) {
      let constext = this;
      const now = Date.now();
      const waitetime = wait - (now - provious);
      // 说明到时间
      if (waitetime <= 0) {
        provious = now;
        func.apply(constext, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          console.log('Date.now()');
          provious = Date.now();
          timeout = undefined;
          // func.apply(constext, args);
        }, wait);
      }
    };
  }
  // function throttle(func, wait = 100) {
  //   let timeout;
  //   let elapsed;
  //   let lastRunTime = Date.now(); // 上次运行时间
  //   return function none(...args) {
  //     const _this = this;
  //     if (typeof timeout === "number") {
  //       window.clearTimeout(timeout);
  //     }
  //     elapsed = Date.now() - lastRunTime;
  //     function later() {
  //       console.log('Date.now()');
  //       lastRunTime = Date.now();
  //       timeout = null;
  //       func.apply(_this, args);
  //     }
  //     if (elapsed > wait) {
  //       later();
  //     } else {
  //       timeout = window.setTimeout(later, wait - elapsed);
  //     }
  //   };
  // }
  window.yyinspector = new YYDomInspector();
})();
