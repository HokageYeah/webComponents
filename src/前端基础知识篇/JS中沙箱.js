(() => {
  var foo = "foo1";
  // 执行上下文对象
  const ctx = {
    func: (variable) => {
      console.log(variable);
    },
  };

  // 构造一个 with 来包裹需要执行的代码，返回 with 代码块的一个函数实例
  function withedYourCode(code) {
    code = "with(shadow) {" + code + "}";
    return new Function("shadow", code);
  }

  // 可访问全局作用域的白名单列表
  const access_white_list = ["func"];

  // 待执行程序
  const code = `func(foo)`;

  // 执行上下文对象的代理对象
  const ctxProxy = new Proxy(ctx, {
    has: (target, prop) => {
      // has 可以拦截 with 代码块中任意属性的访问
      if (access_white_list.includes(prop)) {
        // 在可访问的白名单内，可继续向上查找
        return target.hasOwnProperty(prop);
      }
      if (!target.hasOwnProperty(prop)) {
        throw new Error(`Not found - ${prop}!`);
      }
      return true;
    },
  });

  // 没那么简陋的沙箱
  function littlePoorSandbox(code, ctx) {
    // 将 this 指向手动构造的全局代理对象
    withedYourCode(code).call(ctx, ctx);
  }
  littlePoorSandbox(code, ctxProxy);

  // 执行func(foo)，报错： Uncaught Error: Not found - foo!
})();



/**
 * 利用 iframe 实现沙箱的示例
 */
(() => {
  // 沙箱全局代理对象类
  class SandboxGlobalProxy {
    constructor(sharedState) {
      // 创建一个 iframe 标签，取出其中的原生浏览器全局对象作为沙箱的全局对象
      const iframe = document.createElement("iframe", { url: "about:blank" });
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      const sandboxGlobal = iframe.contentWindow; // 沙箱运行时的全局对象

      return new Proxy(sandboxGlobal, {
        has: (target, prop) => {
          // has 可以拦截 with 代码块中任意属性的访问
          if (sharedState.includes(prop)) {
            // 如果属性存在于共享的全局状态中，则让其沿着原型链在外层查找
            return false;
          }
          if (!target.hasOwnProperty(prop)) {
            throw new Error(`Not find - ${prop}!`);
          }
          return true;
        },
      });
    }
  }

  // 构造一个 with 来包裹需要执行的代码，返回 with 代码块的一个函数实例
  function withedYourCode(code) {
    code = "with(sandbox) {" + code + "}";
    return new Function("sandbox", code);
  }
  function maybeAvailableSandbox(code, ctx) {
    withedYourCode(code).call(ctx, ctx);
  }

  const code_1 = `
    console.log(history == window.history) // false
    window.abc = 'sandbox'
    Object.prototype.toString = () => {
        console.log('Traped!')
    }
    console.log(window.abc) // sandbox
  `;

  const sharedGlobal_1 = ["history"]; // 希望与外部执行环境共享的全局对象

  const globalProxy_1 = new SandboxGlobalProxy(sharedGlobal_1);

  maybeAvailableSandbox(code_1, globalProxy_1);

  // 对外层的window对象没有影响
  console.log(window.abc); // undefined
  Object.prototype.toString(); // 并没有打印 Traped
})();
