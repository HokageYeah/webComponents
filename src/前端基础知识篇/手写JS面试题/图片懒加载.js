/**
 * 图片的懒加载原理： 当图片元素出现在屏幕中时，才给图片的 src 赋值对应的链接，去加载对应的图片
    使用IntersectionObserver监听元素来判断是否出现在视口，当图片出现在视口时，给 img.src 赋值
    IntersectionObserver 替代监听 scroll 事件来判断元素是否在视口中，性能更高
 */

// html内容
// <img src="./loading.jpg" data-src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg">
// <img src="./loading.jpg" data-src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg">

function observerImg() {
  // 获取所有的图片元素
  let imgList = document.getElementsByTagName("img");
  let observer = new IntersectionObserver((list) => {
    // 回调的数据是一个数组
    list.forEach((item) => {
      // 判断元素是否出现在视口
      if (item.intersectionRatio > 0) {
        // 设置img的src属性
        item.target.src = item.target.getAttribute("data-src");
        // 设置src属性后，停止监听
        observer.unobserve(item.target);
      }
    });
  });
  for (let i = 0; i < imgList.length; i++) {
    // 监听每个img元素
    observer.observe(imgList[i]);
  }
}
