
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = ".dom-inspector {\n    position: fixed;\n    pointer-events: none;\n    transform-origin: 0 0;\n}\n\n.dom-inspector > div {\n    position: absolute;\n    pointer-events: none;\n}\n\n.dom-inspector-wrapper .tips {\n    max-width: 70%;\n    background-color: #333740;\n    font-size: 0;\n    line-height: 18px;\n    padding: 3px 10px;\n    position: fixed;\n    border-radius: 4px;\n    display: none;\n    pointer-events: none;\n}\n\n.dom-inspector-wrapper .tips.reverse {\n}\n\n.dom-inspector-wrapper .tips .triangle {\n    width: 0;\n    height: 0;\n    position: absolute;\n    border-top: 8px solid #333740;\n    border-right: 8px solid transparent;\n    border-bottom: 8px solid transparent;\n    border-left: 8px solid transparent;\n    left: 10px;\n    bottom: -16px;\n}\n\n.dom-inspector-wrapper .tips.reverse .triangle {\n    border-top: 8px solid transparent;\n    border-right: 8px solid transparent;\n    border-bottom: 8px solid #333740;\n    border-left: 8px solid transparent;\n    left: 10px;\n    top: -16px;\n}\n\n.dom-inspector-wrapper .tips.reverse-r .triangle {\n    left: auto;\n    right: 10px;\n}\n\n.dom-inspector-wrapper .tips > div {\n    display: inline-block;\n    vertical-align: middle;\n    font-size: 12px;\n    font-family: Consolas, Menlo, Monaco, Courier, monospace;\n    overflow: auto;\n}\n\n.dom-inspector-wrapper .tips .tag {\n    color: #e776e0;\n}\n\n.dom-inspector-wrapper .tips .id {\n    color: #eba062;\n}\n\n.dom-inspector-wrapper .tips .class {\n    color: #8dd2fb;\n}\n\n.dom-inspector-wrapper .tips .line {\n    color: #fff;\n}\n\n.dom-inspector-wrapper .tips .size {\n    color: #fff;\n}\n\n.dom-inspector-theme-default .margin {\n    background-color: rgb(246, 193, 139, 0.75);\n}\n\n.dom-inspector-theme-default .border {\n    background-color: rgba(250, 215, 138, 0.75);\n}\n\n.dom-inspector-theme-default .padding {\n    background-color: rgba(182, 200, 120, 0.75);\n}\n\n.dom-inspector-theme-default .content {\n    background-color: rgba(81, 101, 255, 0.75);\n}\n";
  styleInject(css_248z);

  function mixin(target, source) {
      const targetCopy = target;
      Object.keys(source).forEach((item) => {
          if ({}.hasOwnProperty.call(source, item)) {
              targetCopy[item] = source[item];
          }
      });
      return targetCopy;
  }
  function throttle(func, wait = 100) {
      let timeout;
      let elapsed;
      let lastRunTime = Date.now(); // 上次运行时间
      return function none(...args) {
          const _this = this;
          if (typeof timeout === 'number') {
              window.clearTimeout(timeout);
          }
          elapsed = Date.now() - lastRunTime;
          function later() {
              lastRunTime = Date.now();
              timeout = null;
              func.apply(_this, args);
          }
          if (elapsed > wait) {
              later();
          }
          else {
              timeout = window.setTimeout(later, wait - elapsed);
          }
      };
  }
  const svgTags = ['svg', 'path', 'g', 'image', 'text', 'line', 'rect', 'polygon', 'circle', 'ellipse'];
  const ignoreTags = ['html', 'body', ...svgTags];
  const getTagName = (ele) => {
      const tag = ele.tagName.toLowerCase();
      if (svgTags.indexOf(tag) !== -1) {
          return `*[name()='${tag}']`;
      }
      return tag;
  };
  function getMax(arrOrObj) {
      let arr = arrOrObj;
      if (arrOrObj instanceof Object) {
          arr = Object.keys(arrOrObj).map((v) => arrOrObj[v]);
      }
      let max = 0;
      for (let i = 0; i < arr.length; i++) {
          if (arr[i] > max) {
              max = arr[i];
          }
      }
      return max;
  }
  function judgeNums({ num, total, min = 5, ratio = 0.7, }) {
      if (num < min)
          return false;
      return Number((num / total).toFixed(1)) >= ratio;
  }
  const touchactionStyle = document.createElement('style');
  document.head.appendChild(touchactionStyle);
  function touchAction(enable = false) {
      if (!enable) {
          touchactionStyle.innerHTML = `
        * {
            touch-action: none;
        }`;
      }
      else {
          touchactionStyle.innerHTML = '';
      }
  }

  function isDOM(obj) {
      return (obj &&
          typeof obj === 'object' &&
          obj.nodeType === 1 &&
          typeof obj.style === 'object' &&
          typeof obj.ownerDocument === 'object');
  }
  function $(selector, parent) {
      if (parent !== undefined && isDOM(parent)) {
          return parent.querySelector(selector);
      }
      return document.querySelector(selector);
  }
  function addRule(selector, cssObj) {
      Object.keys(cssObj).forEach((item) => {
          selector.style.setProperty(item, cssObj[item]);
      });
  }
  function findIndex(ele, currentTag) {
      let nth = 0;
      while (ele) {
          if (ele.nodeName.toLowerCase() === currentTag)
              nth += 1;
          ele = ele.previousElementSibling;
      }
      return nth;
  }
  function getScale(ele) {
      const pos = ele.getBoundingClientRect();
      const scalex = Number((ele.offsetWidth === undefined ? 1 : ele.offsetWidth / pos.width).toFixed(1));
      const scaley = Number((ele.offsetHeight === undefined ? 1 : ele.offsetHeight / pos.height).toFixed(1));
      return {
          scalex,
          scaley,
      };
  }
  function findPos(ele) {
      const computedStyle = window.getComputedStyle(ele);
      const pos = ele.getBoundingClientRect();
      // 获取元素本身的缩放比例
      const { scalex, scaley } = getScale(ele);
      // 计算元素缩放前的位置
      const x = pos.left * scalex - parseFloat(computedStyle.getPropertyValue('margin-left'));
      const y = pos.top * scaley - parseFloat(computedStyle.getPropertyValue('margin-top'));
      const r = pos.right * scalex + parseFloat(computedStyle.getPropertyValue('margin-right'));
      return {
          top: y,
          left: x,
          right: r,
          scalex,
          scaley,
      };
  }
  function getElementInfo(ele) {
      const result = {};
      const requiredValue = [
          'border-top-width',
          'border-right-width',
          'border-bottom-width',
          'border-left-width',
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'z-index',
      ];
      const computedStyle = getComputedStyle(ele);
      requiredValue.forEach((item) => {
          result[item] = parseFloat(computedStyle.getPropertyValue(item)) || 0;
      });
      const info = ele.getBoundingClientRect();
      // FIXME: 简单兼容svg元素offsetWidth, offsetHeight 为空的场景
      // TODO: 需要判断Svg元素的box-sizing，来决定其width,height是否需要减去padding, border
      const width = ele.offsetWidth === undefined
          ? info.width
          : ele.offsetWidth -
              result['border-left-width'] -
              result['border-right-width'] -
              result['padding-left'] -
              result['padding-right'];
      const height = ele.offsetHeight === undefined
          ? info.height
          : ele.offsetHeight -
              result['border-top-width'] -
              result['border-bottom-width'] -
              result['padding-top'] -
              result['padding-bottom'];
      mixin(result, {
          width,
          height,
      });
      mixin(result, findPos(ele));
      return result;
  }
  function getMaxZIndex() {
      return [...document.querySelectorAll('*')].reduce((r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0), 0);
  }
  function createElement(tag, attr, content) {
      const ele = window.document.createElement(tag);
      Object.keys(attr).forEach((item) => {
          ele.setAttribute(item, attr[item]);
      });
      if (content)
          ele.innerHTML = content;
      return ele;
  }
  function createSurroundEle(parent, className, content) {
      const ele = createElement('div', {
          class: className,
      }, content);
      parent.appendChild(ele);
      return ele;
  }
  function addOverlay({ target, root, id = 'dom-inspector', assistEle, theme = 'dom-inspector-theme-default', maxZIndex = 9999, }) {
      if (!target)
          return null;
      const wrapper = createElement('div', {
          style: `z-index: ${maxZIndex}`,
          class: 'dom-inspector-wrapper',
      });
      const parent = createElement('div', {
          id,
          class: `dom-inspector ${theme}`,
          style: `z-index: ${maxZIndex}`,
      });
      wrapper.appendChild(parent);
      const overlay = {
          parent,
          content: createSurroundEle(parent, 'content'),
          paddingTop: createSurroundEle(parent, 'padding padding-top'),
          paddingRight: createSurroundEle(parent, 'padding padding-right'),
          paddingBottom: createSurroundEle(parent, 'padding padding-bottom'),
          paddingLeft: createSurroundEle(parent, 'padding padding-left'),
          borderTop: createSurroundEle(parent, 'border border-top'),
          borderRight: createSurroundEle(parent, 'border border-right'),
          borderBottom: createSurroundEle(parent, 'border border-bottom'),
          borderLeft: createSurroundEle(parent, 'border border-left'),
          marginTop: createSurroundEle(parent, 'margin margin-top'),
          marginRight: createSurroundEle(parent, 'margin margin-right'),
          marginBottom: createSurroundEle(parent, 'margin margin-bottom'),
          marginLeft: createSurroundEle(parent, 'margin margin-left'),
          tips: createSurroundEle(wrapper, 'tips', '<div class="tag"></div><div class="id"></div><div class="class"></div><div class="line">&nbsp;|&nbsp;</div><div class="size"></div><div class="triangle"></div>'),
      };
      const { scalex: scalexP, scaley: scaleyP } = getScale(assistEle);
      const { scalex: scalexE, scaley: scaleyE } = getScale(target);
      const elementInfo = getElementInfo(target);
      const contentLevel = {
          width: elementInfo.width,
          height: elementInfo.height,
      };
      const paddingLevel = {
          width: elementInfo['padding-left'] + contentLevel.width + elementInfo['padding-right'],
          height: elementInfo['padding-top'] + contentLevel.height + elementInfo['padding-bottom'],
      };
      const borderLevel = {
          width: elementInfo['border-left-width'] +
              paddingLevel.width +
              elementInfo['border-right-width'],
          height: elementInfo['border-top-width'] +
              paddingLevel.height +
              elementInfo['border-bottom-width'],
      };
      const marginLevel = {
          width: elementInfo['margin-left'] + borderLevel.width + elementInfo['margin-right'],
          height: elementInfo['margin-top'] + borderLevel.height + elementInfo['margin-bottom'],
      };
      // so crazy
      addRule(overlay.parent, {
          width: `${marginLevel.width}px`,
          height: `${marginLevel.height}px`,
          top: `${(elementInfo.top / scaleyE) * scaleyP}px`,
          left: `${(elementInfo.left / scalexE) * scalexP}px`,
      });
      if (scalexE !== scalexP || scaleyE !== scaleyP) {
          addRule(overlay.parent, {
              transform: `scale(${scalexP / scalexE}, ${scaleyP / scaleyE})`,
          });
      }
      addRule(overlay.content, {
          width: `${contentLevel.width}px`,
          height: `${contentLevel.height}px`,
          top: `${elementInfo['margin-top'] + elementInfo['border-top-width'] + elementInfo['padding-top']}px`,
          left: `${elementInfo['margin-left'] +
            elementInfo['border-left-width'] +
            elementInfo['padding-left']}px`,
      });
      addRule(overlay.paddingTop, {
          width: `${paddingLevel.width}px`,
          height: `${elementInfo['padding-top']}px`,
          top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
          left: `${elementInfo['margin-left'] + elementInfo['border-left-width']}px`,
      });
      addRule(overlay.paddingRight, {
          width: `${elementInfo['padding-right']}px`,
          height: `${paddingLevel.height - elementInfo['padding-top']}px`,
          top: `${elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
          right: `${elementInfo['margin-right'] + elementInfo['border-right-width']}px`,
      });
      addRule(overlay.paddingBottom, {
          width: `${paddingLevel.width - elementInfo['padding-right']}px`,
          height: `${elementInfo['padding-bottom']}px`,
          bottom: `${elementInfo['margin-bottom'] + elementInfo['border-bottom-width']}px`,
          right: `${elementInfo['padding-right'] +
            elementInfo['margin-right'] +
            elementInfo['border-right-width']}px`,
      });
      addRule(overlay.paddingLeft, {
          width: `${elementInfo['padding-left']}px`,
          height: `${paddingLevel.height - elementInfo['padding-top'] - elementInfo['padding-bottom']}px`,
          top: `${elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
          left: `${elementInfo['margin-left'] + elementInfo['border-left-width']}px`,
      });
      addRule(overlay.borderTop, {
          width: `${borderLevel.width}px`,
          height: `${elementInfo['border-top-width']}px`,
          top: `${elementInfo['margin-top']}px`,
          left: `${elementInfo['margin-left']}px`,
      });
      addRule(overlay.borderRight, {
          width: `${elementInfo['border-right-width']}px`,
          height: `${borderLevel.height - elementInfo['border-top-width']}px`,
          top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
          right: `${elementInfo['margin-right']}px`,
      });
      addRule(overlay.borderBottom, {
          width: `${borderLevel.width - elementInfo['border-right-width']}px`,
          height: `${elementInfo['border-bottom-width']}px`,
          bottom: `${elementInfo['margin-bottom']}px`,
          right: `${elementInfo['margin-right'] + elementInfo['border-right-width']}px`,
      });
      addRule(overlay.borderLeft, {
          width: `${elementInfo['border-left-width']}px`,
          height: `${borderLevel.height -
            elementInfo['border-top-width'] -
            elementInfo['border-bottom-width']}px`,
          top: `${elementInfo['margin-top'] + elementInfo['border-top-width']}px`,
          left: `${elementInfo['margin-left']}px`,
      });
      addRule(overlay.marginTop, {
          width: `${marginLevel.width}px`,
          height: `${elementInfo['margin-top']}px`,
          top: 0,
          left: 0,
      });
      addRule(overlay.marginRight, {
          width: `${elementInfo['margin-right']}px`,
          height: `${marginLevel.height - elementInfo['margin-top']}px`,
          top: `${elementInfo['margin-top']}px`,
          right: 0,
      });
      addRule(overlay.marginBottom, {
          width: `${marginLevel.width - elementInfo['margin-right']}px`,
          height: `${elementInfo['margin-bottom']}px`,
          bottom: 0,
          right: `${elementInfo['margin-right']}px`,
      });
      addRule(overlay.marginLeft, {
          width: `${elementInfo['margin-left']}px`,
          height: `${marginLevel.height - elementInfo['margin-top'] - elementInfo['margin-bottom']}px`,
          top: `${elementInfo['margin-top']}px`,
          left: 0,
      });
      $('.tag', overlay.tips).innerHTML = target.tagName.toLowerCase();
      $('.id', overlay.tips).innerHTML = target.id ? `#${target.id}` : '';
      // $('.class', overlay.tips).innerHTML = [...target.classList].map(item => `.${item}`).join('');
      $('.size', overlay.tips).innerHTML = `${marginLevel.width / scalexE}x${marginLevel.height / scaleyE}`;
      let tipsTop = 0;
      const tipsOrigin = ['top', 'left'];
      if (elementInfo.top / scaleyE >= 24 + 8) {
          overlay.tips.classList.remove('reverse');
          tipsTop = (elementInfo.top / scaleyE - 24 - 8) * scaleyP;
          tipsOrigin[0] = 'top';
      }
      else {
          overlay.tips.classList.add('reverse');
          tipsTop = ((marginLevel.height + elementInfo.top) / scaleyE + 8) * scaleyP;
          tipsOrigin[0] = 'top';
      }
      const lr = {
          left: 'auto',
          right: 'auto',
      };
      if ((elementInfo.left / scalexE) * scalexP > document.body.clientWidth * 0.7) {
          overlay.tips.classList.add('reverse-r');
          tipsOrigin[1] = 'right';
          lr.right = `${document.body.clientWidth - (elementInfo.right / scalexE) * scalexP}px`;
      }
      else {
          overlay.tips.classList.remove('reverse-r');
          lr.left = `${(elementInfo.left / scalexE) * scalexP}px`;
          tipsOrigin[1] = 'left';
      }
      addRule(overlay.tips, Object.assign(Object.assign({ top: `${tipsTop}px` }, lr), { display: 'block', 'z-index': maxZIndex }));
      if (Number(scalexP) !== 1 || Number(scaleyP) !== 1) {
          addRule(overlay.tips, {
              transform: `scale(${scalexP}, ${scaleyP})`,
              'transform-origin': `${tipsOrigin[0]} ${tipsOrigin[1]}`,
          });
      }
      root.appendChild(wrapper);
      return () => {
          parent.parentNode.removeChild(parent);
      };
  }
  function detectList(ele) {
      if (!ele)
          return false;
      let cur = ele;
      let preLevel = 0;
      while (cur && cur.nodeType === Node.ELEMENT_NODE && cur !== document.body) {
          // 父节点
          const parent = cur.parentNode;
          const childrens = parent.children;
          const tagMap = {};
          const classMap = {};
          // 统计直系子节点的tagName和className
          for (let i = 0; i < childrens.length; i++) {
              const child = childrens[i];
              if (tagMap[child.tagName]) {
                  tagMap[child.tagName] += 1;
              }
              else {
                  tagMap[child.tagName] = 1;
              }
              const classList = child.classList;
              const length = classList.length > 4 ? 4 : classList.length;
              for (let j = 0; j < length; j++) {
                  const classItem = classList[j];
                  if (classMap[classItem]) {
                      classMap[classItem] += 1;
                  }
                  else {
                      classMap[classItem] = 1;
                  }
              }
          }
          // 计算直接子节点的最大tagname数量
          const tagMax = getMax(tagMap);
          // 计算直接子节点的最大classname数量
          const classMax = getMax(classMap);
          if (!judgeNums({
              num: tagMax,
              total: childrens.length,
          })) {
              cur = cur.parentNode;
              preLevel += 1;
              continue;
          }
          if (!judgeNums({
              num: classMax,
              total: childrens.length,
          })) {
              cur = cur.parentNode;
              preLevel += 1;
              continue;
          }
          // 统计直系孙子节点tagname组成的path
          const pathMap = {};
          for (let i = 0; i < childrens.length; i++) {
              const grandChilds = childrens[i].children;
              const path = [];
              for (let j = 0; j < grandChilds.length; j++) {
                  path.push(grandChilds[j].tagName);
              }
              const str = path.join('~');
              if (pathMap[str]) {
                  pathMap[str] += 1;
              }
              else {
                  pathMap[str] = 1;
              }
          }
          const pathMax = getMax(pathMap);
          if (!judgeNums({
              num: pathMax,
              total: childrens.length,
              min: 2,
          })) {
              cur = cur.parentNode;
              preLevel += 1;
              continue;
          }
          return {
              listEl: cur,
              ele,
              preLevel,
          };
      }
      return false;
  }
  function getTouchMouseTargetElement(e) {
      if (e instanceof TouchEvent && e.touches) {
          const changedTouch = e.changedTouches[0];
          return document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
      }
      return e.target;
  }
  // 最新版本，支持 id 支持 div [1] 场景
  // 对于 id，保留最近一层的 id 元素，svg 元素除外
  // 对于 div [1], 除了 svg元素、html、body，都保留 [1]
  // allId: 是否仅保留最近一层 id，列表元素选择时以防万一，选择保留所有 id
  function getXpath(ele, allId = false) {
      if (!isDOM(ele)) {
          return null;
      }
      let cur = ele;
      let hasAddedId = false;
      const hasSvgEle = svgTags.indexOf(cur.tagName.toLowerCase()) !== -1;
      const path = [];
      while (cur && cur.nodeType === Node.ELEMENT_NODE) {
          const currentTag = cur.nodeName.toLowerCase();
          const nth = findIndex(cur, currentTag);
          let idMark = '';
          if (!hasAddedId && cur.hasAttribute('id')) {
              // 仅保留最近一层的id
              idMark = `[@id="${cur.id}"]`;
              hasAddedId = true;
          }
          let nthmark = '';
          if (idMark) {
              nthmark = '';
          }
          else if (ignoreTags.indexOf(currentTag) === -1) {
              nthmark = `[${nth}]`;
          }
          else {
              nthmark = nth === 1 ? '' : `[${nth}]`;
          }
          path.push(`${getTagName(cur)}${nthmark}${idMark}`);
          // svg元素会一直往上冒，由于 intersectionObser 对 svg 无效，所以需要获取完整的 xpath 来寻找最近的非 svg 元素
          if (idMark && !hasSvgEle && !allId) {
              path.push('');
              break;
          }
          cur = cur.parentNode;
      }
      return `/${path.reverse().join('/')}`;
  }
  function getXpathList(ele, preLevel = 0) {
      if (!isDOM(ele)) {
          return null;
      }
      let path = getXpath(ele, true);
      if (!path) {
          return null;
      }
      path = path.split('/').slice(1).reverse();
      path[preLevel] = `${path[preLevel].split('[')[0]}[*]`;
      return `/${path.reverse().join('/')}`;
  }
  function getElesByXpath(xpath, max = 200) {
      const doc = document;
      const result = doc.evaluate(xpath, doc);
      let item = result;
      const eles = [];
      let count = 0;
      while (item && count < max) {
          item = result.iterateNext();
          if (item) {
              eles.push(item);
          }
          count++;
      }
      return eles;
  }

  // learn from https://github.com/luoye-fe/dom-inspector
  const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent);
  const body = document.querySelector('body');
  const html = document.querySelector('html');
  class DomInspector {
      constructor(options = {}) {
          this.theme = 'dom-inspector-theme-default';
          this.maxZIndex = getMaxZIndex() + 1;
          this.mode = 'single';
          this.env = isMobile ? 'mobile' : 'pc';
          this.xpath = null;
          this.target = '';
          this.status = 'disable';
          this.onMoveSelect = () => { };
          this.onDidSelect = () => { };
          // 创建辅助元素，用于判断圈选器元素是否被缩放
          this.assistEle = createElement('div', {
              style: `pointer-events: none;
        visibility: hidden;
        width: 100px;
        height: 100px;
        position: absolute;
        top: -100px;`
          });
          this._cachedTarget = '';
          this.event = 'mousemove';
          this.overlay = createElement('div', {
              id: 'dom-inspector-root',
              style: `z-index: ${this.maxZIndex};`,
          });
          if (options.theme !== undefined) {
              this.theme = options.theme;
          }
          if (options.maxZIndex !== undefined) {
              this.maxZIndex = options.maxZIndex;
          }
          if (options.mode !== undefined) {
              this.mode = options.mode;
          }
          if (options.env !== undefined) {
              this.env = options.env;
          }
          this.event = this.env === 'pc' ? 'mousemove' : 'touchmove';
          if (options.onMoveSelect !== undefined) {
              this.onMoveSelect = options.onMoveSelect;
          }
          if (options.onDidSelect !== undefined) {
              this.onDidSelect = options.onDidSelect;
          }
          this._throttleOnMove = throttle(this._onMove.bind(this), 100);
          this._onMoveEnd = this._onMoveEnd.bind(this);
          // 在 html 中加入而非 body，从而消除对 dom 的影响 及 mutationObserver 的频繁触发
          html && html.appendChild(this.overlay);
          html && html.appendChild(this.assistEle);
          this._addBodyClick();
      }
      _addBodyClick() {
          // 捕获阶段监听body点击事件
          document.body.addEventListener('click', (e) => {
              if (this.status === 'enable') {
                  // 禁用默认行为
                  e.preventDefault();
                  // 停止事件传播
                  e.stopPropagation();
                  this.onDidSelect(this.target);
              }
          }, true);
      }
      enable(mode = 'single') {
          this.status = 'enable';
          this.xpath = null;
          this.target = '';
          this.mode = mode;
          this.overlay.style.display = 'block';
          body && body.addEventListener(this.event, this._throttleOnMove, {
              capture: true,
              passive: this.env === 'mobile' ? false : true,
          });
          if (this.env === 'mobile') {
              body && body.addEventListener('touchend', this._onMoveEnd, {
                  capture: true,
                  passive: false,
              });
              touchAction(false);
          }
          return null;
      }
      pause() {
          this.status = 'pause';
          body && body.removeEventListener(this.event, this._throttleOnMove, true);
          if (this.env === 'mobile') {
              body && body.removeEventListener('touchend', this._onMoveEnd, {
                  capture: true,
                  // passive: false,
              });
              touchAction(true);
          }
      }
      disable() {
          this.status = 'disable';
          this.xpath = null;
          this.target = '';
          this.overlay.style.display = 'none';
          this.overlay.style.width = '0';
          this.overlay.style.height = '0';
          body && body.removeEventListener(this.event, this._throttleOnMove, true);
          if (this.env === 'mobile') {
              body && body.removeEventListener('touchend', this._onMoveEnd, {
                  capture: true,
                  // passive: false,
              });
              touchAction(true);
          }
      }
      selectTarget(ele) {
          if (!ele) {
              return;
          }
          this._remove();
          addOverlay({
              target: ele,
              root: this.overlay,
              assistEle: this.assistEle,
          });
      }
      selectTargets(eles) {
          if (!eles || !eles.length) {
              return;
          }
          this._remove();
          const len = eles.length;
          for (let i = 0; i < len; i++) {
              addOverlay({
                  target: eles[i],
                  root: this.overlay,
                  assistEle: this.assistEle,
              });
          }
      }
      _remove() {
          this.overlay.innerHTML = '';
      }
      _onMove(e) {
          const target = getTouchMouseTargetElement(e);
          if (target && this.overlay.contains(target))
              return;
          this.target = target;
          if (target === this._cachedTarget)
              return null;
          this._remove();
          this._cachedTarget = target;
          this.onMoveSelect(target);
          if (this.mode === 'multi') {
              const res = detectList(target);
              if (res) {
                  const xpath = getXpathList(res.ele, res.preLevel);
                  this.xpath = xpath;
                  let eles = getElesByXpath(xpath);
                  // 只展示目标元素左右各4条，共9条元素信息
                  // 长度大于9条，那么以该元素为中心，左右各选择最近的4条作为目标
                  // 如果一侧不足4条，那么直接选择该侧开始的9条元素
                  if (eles.length > 9) {
                      // 左侧不足4条
                      const index = eles.indexOf(res.ele);
                      if (index < 5) {
                          eles = eles.slice(0, 9);
                      }
                      else if (index > eles.length - 5) {
                          // 右侧不足4条
                          eles = eles.slice(-9);
                      }
                      else {
                          eles = eles.slice(index - 4, index + 5);
                      }
                  }
                  for (let i = 0; i < eles.length; i++) {
                      addOverlay({
                          target: eles[i],
                          root: this.overlay,
                          assistEle: this.assistEle,
                      });
                  }
                  return;
              }
          }
          this.xpath = null;
          addOverlay({
              target: target,
              root: this.overlay,
              assistEle: this.assistEle,
          });
      }
      _onMoveEnd(e) {
          e.preventDefault();
          this._onMove(e);
          const event = new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window
          });
          const body = document.body;
          setTimeout(() => {
              body.dispatchEvent(event);
          }, 500);
      }
  }

  window.inspector = new DomInspector({
      maxZIndex: 9999,
      onMoveSelect: (target) => {
          console.log(target);
      },
      onDidSelect: (target) => {
          console.log(target);
          window.inspector.pause();
      }
  });

}));
