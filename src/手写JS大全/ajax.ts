// 题目描述:利用 XMLHttpRequest 手写 AJAX 实现

const getJson = (url: string) => {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 304) {
          res(xhr.responseText);
        } else {
          rej(xhr.status);
        }
      }
    };
    xhr.send();
  });
};
