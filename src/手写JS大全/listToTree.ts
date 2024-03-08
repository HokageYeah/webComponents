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
  { id: 6, text: "节点1_1_1", parentId: 2 },
];

const listToTree = (list: any[]) => {
  let temp: any = {}
  let treeData = []
  list.forEach((element, index) => {
    temp[element.id] = element
  });
  for(let key in temp) {
    let value = temp[key]
    if(+value['parentId'] !== 0) {
      // 找到父节点
      const parentNode = temp[value['parentId']]
      if(!parentNode.children) parentNode.children = []
      parentNode.children.push(value)
    }else{
      treeData.push(value)
    }
  }
  console.log(JSON.stringify(treeData));
};



listToTree(listAry);
