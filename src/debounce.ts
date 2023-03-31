window.onload = () => {
  debugger;
  // 防抖
  function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeid: ReturnType<typeof setTimeout>;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      let context = this;
      console.log("再次获取：", context);
      clearTimeout(timeid);
      timeid = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    };
  }
  //  截流
  function throttle<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let provious = 0;
    return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
      let constext = this;
      const now = Date.now();
      const waitetime = wait - (now - provious);
      // 说明到时间
      if (waitetime <= 0) {
        provious = now;
        func.apply(constext, args);
      } else if (!timeout) {
        timeout = setTimeout(() => {
          provious = Date.now();
          timeout = undefined;
          func.apply(constext, args);
        }, wait);
      }
    };
  }
  function btnClick(this: HTMLElement, value: string) {
    console.log("按钮点击了", this, value);
  }
  const but = document.querySelector(".btn") as HTMLElement;
  but?.addEventListener(
    "click",
    throttle(() => {
      btnClick.call(but, "的撒打算打算");
    }, 3000)
  );
};
