function myRepeat(s, n) {
  return new Array(n + 1).join(s);
}

function myRepeat2(s, n) {
  return n > 0 ? s.concat(myRepeat2(s, --n)) : "";
}
