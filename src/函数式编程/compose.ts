function add4(num: number) {
  return num + 4;
}

function multiply3(num: number) {
  return num * 3;
}

function divide2(num: number) {
  return num / 2;
}

function pipe(funcs: any[]) {
  function callback(input: any, func: (arg0: any) => any): any {
    return func(input);
  }

  return function (param: number) {
    return funcs.reduce(callback, param);
  };
}

const compute = pipe([add4, multiply3, divide2])
debugger
console.log(compute(10));

