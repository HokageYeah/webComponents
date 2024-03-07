/**
 *
 * 
 * 
  [
    {
        id: 1,
        text: '节点1',
        parentId: 0 //这里用0表示为顶级节点
    },
    {
        id: 2,
        text: '节点1_1',
        parentId: 1 //通过这个字段来确定子父级
    }
    ...
]

转成
[
    {
        id: 1,
        text: '节点1',
        parentId: 0,
        children: [
            {
                id:2,
                text: '节点1_1',
                parentId:1
            }
        ]
    }
] 
 * 
*/

const listAry = [
  { id: 1, text: "节点1", parentId: 0 },
  { id: 2, text: "节点1_1", parentId: 1 },
  { id: 3, text: "节点1_2", parentId: 1 },
  { id: 4, text: "节点2", parentId: 0 },
  { id: 5, text: "节点2_1", parentId: 4 },
];

const listToTree = (list: any[]) => {
  let temp: any = {};
  let treeData = [];
  for (let i = 0; i < list.length; i++) {
    temp[list[i].id] = list[i];
  }
  for (let key in temp) {
    const value = temp[key];
    const parentId = value.parentId;
    if (+parentId != 0) {
        !temp[parentId].children && (temp[parentId].children = []);
        temp[parentId].children.push(value);
    } else {
      treeData.push(value);
    }
  }
  console.log(treeData);
};

listToTree(listAry);
