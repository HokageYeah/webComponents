window.onload = () => {
    debugger;
    // 防抖
    function debounce(func, wait) {
        let timeid;
        return function (...args) {
            let context = this;
            console.log("再次获取：", context);
            clearTimeout(timeid);
            timeid = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    //  截流
    function throttle(func, wait) {
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
            }
            else if (!timeout) {
                timeout = setTimeout(() => {
                    provious = Date.now();
                    timeout = undefined;
                    func.apply(constext, args);
                }, wait);
            }
        };
    }
    function btnClick(value) {
        console.log("按钮点击了", this, value);
    }
    const but = document.querySelector(".btn");
    but === null || but === void 0 ? void 0 : but.addEventListener("click", throttle(() => {
        btnClick.call(but, "的撒打算打算");
    }, 3000));
};
