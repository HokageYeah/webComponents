

Array.prototype.slice.call(arryLike);
Array.prototype.splice.call(arryLike, 0);
Array.prototype.concat.apply([], arryLike);
Array.from(arryLike);