import { mixin, getMax, judgeNums, getTagName, svgTags, ignoreTags } from './utils';

export function isDOM(obj:any) {
    return (
        obj &&
        typeof obj === 'object' &&
        obj.nodeType === 1 &&
        typeof obj.style === 'object' &&
        typeof obj.ownerDocument === 'object'
    );
}

export function $(selector: string, parent?: HTMLElement) {
    if (parent !== undefined && isDOM(parent)) {
        return parent.querySelector(selector);
    }
    return document.querySelector(selector);
}

export function addRule(selector: HTMLElement, cssObj: {[key: string]: any}) {
    Object.keys(cssObj).forEach((item) => {
        selector.style.setProperty(item, cssObj[item]);
    });
}

export function findIndex(ele: Element | null, currentTag: string) {
    let nth = 0;
    while (ele) {
        if (ele.nodeName.toLowerCase() === currentTag) nth += 1;
        ele = ele.previousElementSibling;
    }
    return nth;
}

function getScale(ele: HTMLElement) {
    const pos = ele.getBoundingClientRect();
    const scalex = Number((ele.offsetWidth === undefined ? 1 : ele.offsetWidth / pos.width).toFixed(1));
    const scaley = Number((ele.offsetHeight === undefined ? 1 : ele.offsetHeight / pos.height).toFixed(1));

    return {
        scalex,
        scaley,
    };
}

function findPos(ele: HTMLElement) {
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

export function getElementInfo(ele: HTMLElement) {
    const result:{[key: string]: any} = {};
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
    const width =
        ele.offsetWidth === undefined
            ? info.width
            : ele.offsetWidth -
              result['border-left-width'] -
              result['border-right-width'] -
              result['padding-left'] -
              result['padding-right'];

    const height =
        ele.offsetHeight === undefined
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

export function getMaxZIndex() {
    return [...document.querySelectorAll('*')].reduce(
        (r, e) => Math.max(r, +window.getComputedStyle(e).zIndex || 0),
        0
    );
}

export function createElement(tag: string, attr: {[key: string]: any}, content?: string) {
    const ele = window.document.createElement(tag);
    Object.keys(attr).forEach((item) => {
        ele.setAttribute(item, attr[item]);
    });
    if (content) ele.innerHTML = content;
    return ele;
}

export function createSurroundEle(parent: HTMLElement, className?: string, content?: string) {
    const ele = createElement(
        'div',
        {
            class: className,
        },
        content
    );
    parent.appendChild(ele);
    return ele;
}

export function addOverlay({
    target,
    root,
    id = 'dom-inspector',
    assistEle,
    theme = 'dom-inspector-theme-default',
    maxZIndex = 9999,
}: {
    target: HTMLElement,
    root: HTMLElement,
    id?: string,
    assistEle: HTMLElement,
    theme?: string,
    maxZIndex?: number
}) {
    if (!target) return null;
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
        tips: createSurroundEle(
            wrapper,
            'tips',
            '<div class="tag"></div><div class="id"></div><div class="class"></div><div class="line">&nbsp;|&nbsp;</div><div class="size"></div><div class="triangle"></div>'
        ),
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
        width:
            elementInfo['border-left-width'] +
            paddingLevel.width +
            elementInfo['border-right-width'],
        height:
            elementInfo['border-top-width'] +
            paddingLevel.height +
            elementInfo['border-bottom-width'],
    };
    const marginLevel: {
        width: number,
        height: number,
    } = {
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
        top: `${
            elementInfo['margin-top'] + elementInfo['border-top-width'] + elementInfo['padding-top']
        }px`,
        left: `${
            elementInfo['margin-left'] +
            elementInfo['border-left-width'] +
            elementInfo['padding-left']
        }px`,
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
        top: `${
            elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']
        }px`,
        right: `${elementInfo['margin-right'] + elementInfo['border-right-width']}px`,
    });
    addRule(overlay.paddingBottom, {
        width: `${paddingLevel.width - elementInfo['padding-right']}px`,
        height: `${elementInfo['padding-bottom']}px`,
        bottom: `${elementInfo['margin-bottom'] + elementInfo['border-bottom-width']}px`,
        right: `${
            elementInfo['padding-right'] +
            elementInfo['margin-right'] +
            elementInfo['border-right-width']
        }px`,
    });
    addRule(overlay.paddingLeft, {
        width: `${elementInfo['padding-left']}px`,
        height: `${
            paddingLevel.height - elementInfo['padding-top'] - elementInfo['padding-bottom']
        }px`,
        top: `${
            elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width']
        }px`,
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
        height: `${
            borderLevel.height -
            elementInfo['border-top-width'] -
            elementInfo['border-bottom-width']
        }px`,
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
        height: `${
            marginLevel.height - elementInfo['margin-top'] - elementInfo['margin-bottom']
        }px`,
        top: `${elementInfo['margin-top']}px`,
        left: 0,
    });

    $('.tag', overlay.tips)!.innerHTML = target.tagName.toLowerCase();
    $('.id', overlay.tips)!.innerHTML = target.id ? `#${target.id}` : '';
    // $('.class', overlay.tips).innerHTML = [...target.classList].map(item => `.${item}`).join('');
    $('.size', overlay.tips)!.innerHTML = `${marginLevel.width / scalexE}x${marginLevel.height / scaleyE}`;

    let tipsTop = 0;
    const tipsOrigin = ['top', 'left'];
    if (elementInfo.top / scaleyE >= 24 + 8) {
        overlay.tips.classList.remove('reverse');
        tipsTop = (elementInfo.top / scaleyE - 24 - 8) * scaleyP;
        tipsOrigin[0] = 'top';
    } else {
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
    } else {
        overlay.tips.classList.remove('reverse-r');
        lr.left = `${(elementInfo.left / scalexE) * scalexP}px`;
        tipsOrigin[1] = 'left';
    }

    addRule(overlay.tips, {
        top: `${tipsTop}px`,
        ...lr,
        display: 'block',
        'z-index': maxZIndex,
    });

    if (Number(scalexP) !== 1 || Number(scaleyP) !== 1) {
        addRule(overlay.tips, {
            transform: `scale(${scalexP}, ${scaleyP})`,
            'transform-origin': `${tipsOrigin[0]} ${tipsOrigin[1]}`,
        });
    }

    root.appendChild(wrapper);

    return () => {
        parent.parentNode!.removeChild(parent);
    };
}

export function detectList(ele: Element | null) {
    if (!ele) return false;

    let cur:Element | null | ParentNode = ele;

    let preLevel = 0;

    while (cur && cur.nodeType === Node.ELEMENT_NODE && cur !== document.body) {
        // 父节点
        const parent = cur.parentNode;

        const childrens = parent!.children;

        const tagMap:{[key: string]: number} = {};

        const classMap: {[key: string]: number} = {};

        // 统计直系子节点的tagName和className
        for (let i = 0; i < childrens.length; i++) {
            const child = childrens[i];
            if (tagMap[child.tagName]) {
                tagMap[child.tagName] += 1;
            } else {
                tagMap[child.tagName] = 1;
            }
            const classList = child.classList;
            const length = classList.length > 4 ? 4 : classList.length;
            for (let j = 0; j < length; j++) {
                const classItem = classList[j];
                if (classMap[classItem]) {
                    classMap[classItem] += 1;
                } else {
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
        const pathMap:{[key: string]: number} = {};

        for (let i = 0; i < childrens.length; i++) {
            const grandChilds = childrens[i].children;
            const path = [];
            for (let j = 0; j < grandChilds.length; j++) {
                path.push(grandChilds[j].tagName);
            }
            const str = path.join('~');
            if (pathMap[str]) {
                pathMap[str] += 1;
            } else {
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

export function getTouchMouseTargetElement(e: TouchEvent | MouseEvent) {
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
export function getXpath(ele: HTMLElement, allId = false) {
    if (!isDOM(ele)) {
        return null;
    }
    let cur: HTMLElement | null = ele;
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
        } else if (ignoreTags.indexOf(currentTag) === -1) {
            nthmark = `[${nth}]`;
        } else {
            nthmark = nth === 1 ? '' : `[${nth}]`;
        }
        path.push(`${getTagName(cur)}${nthmark}${idMark}`);
        // svg元素会一直往上冒，由于 intersectionObser 对 svg 无效，所以需要获取完整的 xpath 来寻找最近的非 svg 元素
        if (idMark && !hasSvgEle && !allId) {
            path.push('');
            break;
        }
        cur = cur.parentNode as HTMLElement;
    }
    return `/${path.reverse().join('/')}`;
}

export function getXpathList(ele: HTMLElement, preLevel = 0) {
    if (!isDOM(ele)) {
        return null;
    }

    let path: string | string[] | null = getXpath(ele, true);

    if (!path) {
        return null;
    }

    path = path.split('/').slice(1).reverse();

    path[preLevel] = `${path[preLevel].split('[')[0]}[*]`;

    return `/${path.reverse().join('/')}`;
}

export function getEleByXpath(xpath: string) {
    const doc = document;
    const result = doc.evaluate(xpath, doc);
    const item = result.iterateNext();
    return item;
}

export function getElesByXpath(xpath: string, max = 200) {
    const doc = document;
    const result = doc.evaluate(xpath, doc);
    let item: XPathResult | null | Node = result;
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

export function getNearestNoSvgXpath(xpath: string) {
    if (xpath.indexOf('*[name()=') !== -1) {
        const paths = xpath.split('/');
        const newPath = [];
        for (let i = 0; i < paths.length - 1; i++) {
            const path = paths[i];
            if (path.indexOf('*[name()=') !== -1) {
                break;
            }
            newPath.push(path);
        }
        return newPath.join('/');
    }

    return xpath;
}
