// 将js对象转化为树形结构
// 转换前
const source = [
  { id: 1, pid: 0, name: "部门1" },
  { id: 2, pid: 1, name: "部门2" },
  { id: 3, pid: 2, name: "部门3" },
];

// 转换后
const tree = [
  {
    id: 1,
    pid: 0,
    name: "部门1",
    children: [
      {
        id: 2,
        pid: 1,
        name: "部门2",
        children: [
          {
            id: 3,
            pid: 2,
            name: "部门3",
          },
        ],
      },
    ],
  },
];

function jsonToTree(data) {
  const result = [];
  if (!Array.isArray(data)) {
    return result;
  }
  const map = {};
  for (let i = 0; i < data.length; i++) {
    map[data[i].id] = data[i];
  }
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.pid === 0) {
      result.push(item);
    } else {
      if (!map[item.pid].children) {
        map[item.pid].children = [];
      }
      map[item.pid].children.push(item);
    }
  }
  return result;
}
