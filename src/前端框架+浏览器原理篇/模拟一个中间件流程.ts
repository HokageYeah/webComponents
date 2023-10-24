const m1 = async (next: () => any) => {
    console.log("m1 run");
    await next();
    console.log("result1");
  };
  
  const m2 = async (next: () => any) => {
    console.log("m2 run");
    await next();
    console.log("result2");
  };
  const m3 = async (next: () => any) => {
    console.log("m3 run");
    await next();
    console.log("result3");
  };
  
  const middlewares = [m1, m2, m3];
  
  function useApp() {
    const next = () => {
      const middleware = middlewares.shift();
      if (middleware) {
        return Promise.resolve(middleware(next));
      } else {
        return Promise.resolve("end");
      }
    };
    next();
  }
  // 启动中间件
  useApp();