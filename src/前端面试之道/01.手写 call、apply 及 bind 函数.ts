(() => {
  // 实现 call
  function myCall(this: any, context: any) {
    // 将剩余参数转换成数组，并且取最后一个
    console.log("并且取最后一个-------->", arguments[1]);
    const args = [...arguments].slice(1);
    if (typeof context == null || typeof context == undefined) {
      context = window;
    }
    const symbol = Symbol();
    context[symbol] = this;
    const result = context[symbol](...args);
    console.log("查看数据------？", context);
    delete context[symbol];
    console.log("查看数据------？", context);
    return result;
  }
  Function.prototype.myCall = myCall;
  const obj = {
    a: "myCall渔业",
  };
  function abc(this: any) {
    console.log("myCall调用了", arguments, this);
    return "myCall返回的数据";
  }
  const result = abc.myCall(obj, "哈哈哈", "嘿嘿嘿");
  console.log("myCall数据---->", result);

  // 实现apply
  function myApply(this: any, context: any) {
    if (typeof context == null || typeof context == undefined) {
      context.window;
    }
    const symbol = Symbol();
    context[symbol] = this;
    let result;
    if (arguments[1]) {
      result = context[symbol](...arguments[1]);
    } else {
      result = context[symbol]();
    }
    delete context[symbol];
    return result;
  }
  Function.prototype.myApply = myApply;
  const obj1 = {
    a: "myApply王音节",
  };
  function abc01(this: any) {
    console.log("myApply调用了", arguments, this);
    return "myApply返回的数据";
  }
  const result01 = abc01.myApply(obj1, ["哈哈哈", "嘿嘿嘿"]);
  console.log("myApply数据---->", result01);

})();
