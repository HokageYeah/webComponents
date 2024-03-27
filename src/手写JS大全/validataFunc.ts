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

// 需要验证表单的对象
let userInfo = {
  userName: "王",
  password: "1234",
  phoneNumber: "666",
};
