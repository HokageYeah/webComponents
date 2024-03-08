/** 
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
转成
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
*/

const treeArry = [
    {
        id: 1,
        text: '节点1',
        parentId: 0,
        children: [
            {
                id:2,
                text: '节点1_1',
                parentId:1
            },
            {
                id:3,
                text: '节点1_2',
                parentId:1
            }
        ]
    },
    {
        id: 2,
        text: '节点2',
        parentId: 0,
        children: [
            {
                id:3,
                text: '节点2_1',
                parentId:2
            },
            {
                id:4,
                text: '节点2_2',
                parentId:2
            },
            {
                id:5,
                text: '节点2_3',
                parentId:2
            }
        ]
    }
];

const treeToList = (data: any) => {
    let res: any = []
    // 递归
    const dfs = (tree: any) => {
        tree.forEach((item:any, index: number) => {
            if(item.children) {
                dfs(item.children)
                delete item.children
            }
            res.push(item)
        })
    }
    dfs(data)
    console.log(res);   
}

treeToList(treeArry)