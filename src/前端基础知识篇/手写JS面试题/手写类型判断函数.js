function getType(value) {
  // 判断数据是null的情况
  if (value === null) {
    return value + "";
  }
  //   判断数据是引用类型的情况
  if (typeof value === "object") {
    const valueClass = Object.prototype.toString.call(value);
    const type = valueClass.split(" ")[1].split("]")[0];
    return type.toLowerCase();
  } else {
    return typeof value;
  }
}
