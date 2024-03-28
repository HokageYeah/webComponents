// 策略模式
// 策略对象
const strategies = {
  // 验证是否为空
  isNonEmpty: function (value: string, errorMsg: string) {
    if (value === "") {
      return errorMsg;
    }
  },
  // 验证最小长度
  minLength: function (value: string, length: number, errorMsg: string) {
    if (value.length < length) {
      return errorMsg;
    }
  },
};
class Validator {
  cache: any[];
  errorList: any[];
  constructor() {
    this.cache = [];
    this.errorList = [];
  }
  add(value, rules) {
    let rule;
    console.log("sds");

    for (let i = 0; i < rules.length; i++) {
      const strategy = rules[i].strategy;
      const errorMsg = rules[i].errorMsg;
      let strategyArr = strategy.split(":");
      const func = () => {
        const a1 = strategyArr.shift();
        strategyArr.unshift(value);
        strategyArr.push(errorMsg);
        let error = strategies[a1].apply(null, strategyArr);
        if (error) {
          this.errorList.push(error);
        }
      };
      this.cache.push(func);
    }
  }
  start() {
    this.cache.forEach((item) => item());
    return this.errorList;
  }
}

let validataFunc = (info) => {
  let validator = new Validator();
  validator.add(info.userName, [
    { strategy: "isNonEmpty", errorMsg: "用户名不可为空" },
    {
      strategy: "minLength:2",
      errorMsg: "用户名长度不能小于2位",
    },
  ]);
  validator.add(info.password, [
    { strategy: "minLength:6", errorMsg: "密码长度不能小于6位" },
  ]);
  validator.add(info.phoneNumber, [
    { strategy: "minLength:11", errorMsg: "手机长度不能小于11位" },
  ]);
  return validator.start();
};

// 需要验证表单的对象
let userInfo = {
  userName: "王",
  password: "1234",
  phoneNumber: "666",
};
let errorMsg = validataFunc(userInfo);
console.log(errorMsg); // ['用户名长度不能小于2位', '密码长度不能小于6位', '请输入正确的手机号码格式']
