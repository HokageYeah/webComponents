// 访问者模式
class Student {
  name: any;
  chinese: any;
  math: any;
  englis: any;
  constructor(name, chinese, math, englis) {
    this.name = name;
    this.chinese = chinese;
    this.math = math;
    this.englis = englis;
  }
  //  提供一个访问方法
  accept(visitor) {
    visitor.visit(this);
  }
}

// 访问者类
class Visitor {
  visit(student) {
    console.log(
      student.name +
        " " +
        (student.chinese + "" + student.math + "" + student.englis)
    );
  }
}

// 实例化
const student = new Student("HokageYeah", 90, 50, 40);
const visitor = new Visitor();
student.accept(visitor);
