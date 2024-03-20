// 自执行函数 沙箱一
// (function () {
//   var foo = "foo1";

//   // 执行上下文对象
//   const ctx = {
//     func: (variable) => {
//       console.log(variable);
//     },
//   };

//   // 构造一个 with 来包裹需要执行的代码，返回 with 代码块的一个函数实例
//   function withedYourCode(code) {
//     code = "with(shadow) {" + code + "}";
//     return new Function("shadow", code);
//   }

//   // 可访问全局作用域的白名单列表
//   const access_white_list = ["func"];

//   // 待执行程序
//   const code = "func(foo)";

//   // 执行上下文对象的代理对象
//   const ctxProxy = new Proxy(ctx, {
//     has: (target, prop: any) => {
//       console.log("has---", target, prop);
//       // has 可以拦截 with 代码块中任意属性的访问
//       if (access_white_list.includes(prop)) {
//         // 在可访问的白名单内，可继续向上查找
//         return target.hasOwnProperty(prop);
//       }
//       if (!target.hasOwnProperty(prop)) {
//         throw new Error(`Not found - ${prop}!`);
//       }
//       return true;
//     },
//   });

//   // 没那么简陋的沙箱
//   function littlePoorSandbox(code, ctx) {
//     console.log("littlePoorSandbox---", code, ctx);
//     // 将 this 指向手动构造的全局代理对象
//     withedYourCode(code).call(ctx, ctx);
//   }
//   littlePoorSandbox(code, ctxProxy);

//   // 执行func(foo)，报错： Uncaught Error: Not found - foo!
// })();

// 自执行函数 沙箱二
(function () {
  class SandboxGlobalProxy {
    constructor(sharedState) {
      // 创建一个 iframe 标签，取出其中的原生浏览器全局对象作为沙箱的全局对象
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);
      // iframeWindow作为沙箱运行时的全局对象
      const iframeWindow = iframe.contentWindow;
      return new Proxy(iframeWindow, {
        has(target, prop: string) {
          if (sharedState.includes(prop)) {
            // 如果属性存在于共享的全局状态中，则让其沿着原型链在外层查找
            return target.hasOwnProperty(prop);
          }
          if (!target.hasOwnProperty(prop)) {
            throw new Error(`Not found - ${prop}!`);
          }
          return true;
        },
      });
    }
  }
  // 构造一个 with 来包裹需要执行的代码，返回 with 代码块的一个函数实例
  const withedYourCode = (code) => {
    // code = `with(shadow) { ${code} })`;
    code = "with(sandbox) {" + code + "}";
    return new Function("sandbox", code);
  };
  const maybeAvailableSandbox = (code, ctx) => {
    withedYourCode(code).call(ctx, ctx);
  };
  // 要执行的代码
  const code = `
console.log(history == window.history)
window.abc = 'sandbox'
Object.prototype.toString = () => {
    console.log('Traped!')
}
console.log(window.abc)
`;
  // sharedGlobal作为与外部执行环境共享的全局对象
  // code中获取的history为最外层作用域的history
  const sharedGlobal = ["history"];
  maybeAvailableSandbox(code, new SandboxGlobalProxy(sharedGlobal));
  // 对外层的window对象没有影响
  console.log((window as any).abc); // undefined
  Object.prototype.toString(); // 并没有打印 Traped
})();

// 自执行函数 沙箱三
// (function () {
//   // 沙箱全局代理对象类
//   class SandboxGlobalProxy {
//     constructor(blacklist) {
//       // 创建一个 iframe 标签，取出其中的原生浏览器全局对象作为沙箱的全局对象
//       const iframe = document.createElement("iframe");
//       iframe.style.display = "none";
//       document.body.appendChild(iframe);

//       // 获取当前HTMLIFrameElement的Window对象
//       const sandboxGlobal = iframe.contentWindow;

//       return new Proxy(sandboxGlobal, {
//         // has 可以拦截 with 代码块中任意属性的访问
//         has: (target, prop: string) => {
//           // 黑名单中的变量禁止访问
//           if (blacklist.includes(prop)) {
//             throw new Error(`Can't use: ${prop}!`);
//           }
//           // sandboxGlobal对象上不存在的属性，直接报错，实现禁用三方库调接口
//           if (!target.hasOwnProperty(prop)) {
//             throw new Error(`Not find: ${prop}!`);
//           }

//           // 返回true，获取当前提供上下文对象中的变量；如果返回false，会继续向上层作用域链中查找
//           return true;
//         },
//       });
//     }
//   }

//   // 使用with关键字，来改变作用域
//   function withedYourCode(code) {
//     code = "with(sandbox) {" + code + "}";
//     return new Function("sandbox", code);
//   }

//   // 将指定的上下文对象，添加到待执行代码作用域的顶部
//   function makeSandbox(code, ctx) {
//     withedYourCode(code).call(ctx, ctx);
//   }

//   // 待执行的代码code，获取document对象
//   const code = `console.log(document)`;

//   // 设置黑名单
//   // 经过小伙伴的指导，新添加Image字段，禁止使用new Image来调接口
//   const blacklist = [
//     "window",
//     "document",
//     "XMLHttpRequest",
//     "fetch",
//     "WebSocket",
//     "Image",
//   ];

//   // 将globalProxy对象，添加到新环境作用域链的顶部
//   const globalProxy = new SandboxGlobalProxy(blacklist);

//   makeSandbox(code, globalProxy);
// })();
