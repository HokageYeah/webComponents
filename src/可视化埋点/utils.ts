export function mixin(target:{[key: string]: any}, source: {[key: string]: any}) {
    const targetCopy = target;
    Object.keys(source).forEach((item) => {
        if ({}.hasOwnProperty.call(source, item)) {
            targetCopy[item] = source[item];
        }
    });
    return targetCopy;
}

export function throttle(func: (...args:any) => any, wait = 100) {
    let timeout: number | null;
    let elapsed;
    let lastRunTime = Date.now(); // 上次运行时间
    return function none(this: any, ...args: any) {
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
        } else {
            timeout = window.setTimeout(later, wait - elapsed);
        }
    };
}

export function isNull(obj: any) {
    return (
        Object.prototype.toString
            .call(obj)
            .replace(/\[object[\s]/, '')
            .replace(']', '')
            .toLowerCase() === 'null'
    );
}

export const svgTags = ['svg', 'path', 'g', 'image', 'text', 'line', 'rect', 'polygon', 'circle', 'ellipse'];

export const ignoreTags = ['html', 'body', ...svgTags];

export const getTagName = (ele: HTMLElement) => {
    const tag = ele.tagName.toLowerCase();
    if (svgTags.indexOf(tag) !== -1) {
        return `*[name()='${tag}']`;
    }
    return tag;
};

export function getMax(arrOrObj: {[key: string | number]: any}) {
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

export function judgeNums({
    num,
    total,
    min = 5,
    ratio = 0.7,
}: {
    num: number,
    total: number,
    min?: number,
    ratio?: number,
}) {
    if (num < min) return false;
    return Number((num / total).toFixed(1)) >= ratio;
}

const touchactionStyle = document.createElement('style');
document.head.appendChild(touchactionStyle);

export function touchAction(enable = false) {
    if (!enable) {
        touchactionStyle.innerHTML = `
        * {
            touch-action: none;
        }`;
    } else {
        touchactionStyle.innerHTML = '';
    }
}
