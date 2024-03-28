
// 装饰者模式

(Function.prototype as any).before = function (beFn) {
  let self = this; // fuc
  return function () {
    // console.log('before--', this === window);
    beFn.apply(this, arguments);
    return self.apply(this, arguments);
  };
};

(Function.prototype as any).after = function (afFn) {
  let self = this;
  return function () {
    // console.log('after--', this === window);
    const result = self.apply(this, arguments);
    afFn.apply(this, arguments);
    return result;
  };
};

function fuc() {
  console.log(2);
  return "HokageYeah";
}
function fuc1() {
  console.log(1);
}
function fuc3() {
  console.log(3);
}
function fuc4() {
  console.log(4);
}

const newfuc = (fuc as any).before(fuc1).before(fuc4).after(fuc3);
console.log(newfuc());
