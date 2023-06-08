// learn from https://github.com/luoye-fe/dom-inspector
import './style.css';
import {
    getMaxZIndex,
    detectList,
    addOverlay,
    createElement,
    getTouchMouseTargetElement,
    getElesByXpath,
    getXpathList
} from './dom.js';
import { throttle, touchAction } from './utils';

const isMobile = /Mobi|Android|iPhone/i.test(navigator.userAgent); 

const body = document.querySelector('body');

const html = document.querySelector('html');

type Target = HTMLElement | EventTarget | '' | null;

class DomInspector {
    theme: string = 'dom-inspector-theme-default';
    maxZIndex: number = getMaxZIndex() + 1;
    mode: 'single' | 'multi' = 'single';
    env: 'pc' | 'mobile' = isMobile ? 'mobile' : 'pc';
    xpath: string | null = null;
    target: Target = '';
    status: 'enable' | 'disable' | 'pause' = 'disable';

    private onMoveSelect: (target: Target) => void = () => {};

    private onDidSelect: (target: Target) => void = () => {};

    // 创建辅助元素，用于判断圈选器元素是否被缩放
    private assistEle = createElement('div', {
        style: `pointer-events: none;
        visibility: hidden;
        width: 100px;
        height: 100px;
        position: absolute;
        top: -100px;`
    });

    private _cachedTarget:  HTMLElement | EventTarget | '' | null = '';
    private event: 'mousemove' | 'touchmove' = 'mousemove';

    private overlay: HTMLElement= createElement('div', {
        id: 'dom-inspector-root',
        style: `z-index: ${this.maxZIndex};`,
    });

    private _throttleOnMove: any;

    constructor(options: {
        theme?: string,
        maxZIndex?: number,
        mode?: 'single' | 'multi',
        env?: 'pc' | 'mobile',
        onMoveSelect?: (target: Target) => void,
        onDidSelect?: (target: Target) => void,
    } = {}) {
        if (options.theme !== undefined) {
            this.theme = options.theme;
        }

        if (options.maxZIndex !== undefined) {
            this.maxZIndex = options.maxZIndex
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

    private _addBodyClick() {
        // 捕获阶段监听body点击事件
        document.body.addEventListener(
            'click',
            (e) => {
                if (this.status === 'enable') {
                    // 禁用默认行为
                    e.preventDefault();
                    // 停止事件传播
                    e.stopPropagation();

                    this.onDidSelect(this.target);
                }
            },
            true
        );
    }

    enable(mode: 'single' | 'multi' = 'single') {
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

    selectTarget(ele: HTMLElement) {
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

    selectTargets(eles: HTMLElement[]) {
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

    private _remove() {
        this.overlay.innerHTML = '';
    }

    private _onMove(e: MouseEvent | TouchEvent) {
        const target = getTouchMouseTargetElement(e);

        if (target && this.overlay.contains(target as Node)) return;

        this.target = target;

        if (target === this._cachedTarget) return null;

        this._remove();

        this._cachedTarget = target;

        this.onMoveSelect(target);

        if (this.mode === 'multi') {
            const res = detectList(target as HTMLElement);
            if (res) {
                const xpath = getXpathList(res.ele as HTMLElement, res.preLevel);
                this.xpath = xpath;
                let eles = getElesByXpath(xpath!);
                // 只展示目标元素左右各4条，共9条元素信息
                // 长度大于9条，那么以该元素为中心，左右各选择最近的4条作为目标
                // 如果一侧不足4条，那么直接选择该侧开始的9条元素
                if (eles.length > 9) {
                    // 左侧不足4条
                    const index = eles.indexOf(res.ele);
                    if (index < 5) {
                        eles = eles.slice(0, 9);
                    } else if (index > eles.length - 5) {
                        // 右侧不足4条
                        eles = eles.slice(-9);
                    } else {
                        eles = eles.slice(index - 4, index + 5);
                    }
                }
                for (let i = 0; i < eles.length; i++) {
                    addOverlay({
                        target: eles[i] as HTMLElement,
                        root: this.overlay,
                        assistEle: this.assistEle,
                    });
                }
                return;
            }
        }
        this.xpath = null;
        addOverlay({
            target: target as HTMLElement,
            root: this.overlay,
            assistEle: this.assistEle,
        });
    }

    private _onMoveEnd(e: MouseEvent | TouchEvent) {
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

export default DomInspector;

export * from './dom';
