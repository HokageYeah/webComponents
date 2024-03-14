class EventEmitter {
  private _events: any;
  constructor() {
    this._events = {};
  }
  on(type: string, callback: (...rest: any[]) => void) {
    if (this._events[type]) {
      this._events[type].push(callback);
    } else {
      this._events[type] = [callback];
    }
  }
  emit(type: string, ...rest: number[]) {
    if (this._events[type]) {
      this._events[type].forEach((item: any) => {
        item.apply(this, rest);
      });
    }
  }
  once(type: string, callback: (...rest: any[]) => void) {
    const fn = (...rest: any[]) => {
      callback.apply(this, rest);
      this.off(type, fn);
    };
    this.on(type, fn);
  }
  off(type: string, callback: (...rest: any[]) => void) {
    if (this._events[type]) {
      this._events[type] = this._events[type].filter(
        (item: (...rest: any[]) => void) => {
          return item !== callback;
        }
      );
    }
  }
}

// 使用如下
const eventEmitter = new EventEmitter();

const handle = (...rest: any[]) => {
  console.log(rest);
};
const handle2 = (...rest: any[]) => {
  console.log("123", rest);
};

eventEmitter.on("click", handle);
eventEmitter.on("click", handle2);

eventEmitter.emit("click", 1, 2, 3, 4);

eventEmitter.off("click", handle);
eventEmitter.emit("click", 1, 2, 3, 4);

// eventEmitter.emit("click", 1, 2);

eventEmitter.once("dbClick", () => {
  console.log(123456);
});
eventEmitter.emit("dbClick");
eventEmitter.emit("dbClick");
