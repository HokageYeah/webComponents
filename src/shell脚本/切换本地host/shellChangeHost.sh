# !/bin/bash

# 读取用户输入
echo "请输入一个选项："
echo "1、 switch（会覆盖本地host）"
echo "2、 append（在本地host后追加）"
read -p "请输入：" choiceType

read -p "请输入要切换的 Host 类型（test 或 staging）：" hostType

# 测试写入当前文件的newtest里面
yyhosts=./newtest
# yyhosts=/etc/hosts

loadingLog() {
    echo "操作系统：$1  ⏰ \n切换模式：$choiceType 🚀 \n切换到$hostType 更改中.....🍖"
}

case "$hostType" in
  test)
    inputFile="./test"
    outputFile=$yyhosts
    ;;
  staging)
    inputFile="./staging"
    outputFile=$yyhosts
    ;;
  *)
esac

# 切换host（会覆盖）
switchHost() {
    if [ "$1" == "Mac" ]
    then
        if [ "$hostType" == "test" ]
        then
            sudo cp test $yyhosts
            echo "已切换为测试环境 Host 🎉🎉🎉"
        elif [ "$hostType" == "staging" ]
        then
            sudo cp staging $yyhosts
            echo "已切换为测试环境 staging 🎉🎉🎉"
        else
            echo "输入：$hostType 为未知的Host环境！ ❌❌❌"
        fi
    fi
}
# 抽离追加方法
contentAppend() {
    content=$(cat "$inputFile")
    # 追加内容到输出文件
    sudo sh -c "echo \"$content\" >> "$outputFile""
    echo "$1 Host已经追加 🎉🎉🎉"
}
# 追加host（不会覆盖）
appendHost() {
    if [[ "$1" == "Mac" || "$1" == "Linux" ]]
    then
        if [ "$hostType" == "test" ]
        then
            contentAppend "测试环境"
        elif [ "$hostType" == "staging" ]
        then
            contentAppend "staging环境"
        else
            echo "输入：$hostType 为未知的Host环境！ ❌❌❌"
        fi
    fi
}

loadHost() {
    case "$choiceType" in
        switch)
        switchHost $1
        ;;
        append)
        appendHost $1
        ;;
        *)
        echo "输入模式：$choiceType 为不支持Host切换模式 ❌❌❌"
        exit 1
    esac
}

case "$(uname -s)" in
    MINGW*|CYGWIN*|MSYS*)
        # Windows 平台
        loadingLog Windows
        loadHost Windows
        ;;
    Darwin*)
        # Mac平台
        loadingLog Mac
        loadHost Mac
        ;;
    Linux*)
        # Linux 平台
        loadingLog Linux
        loadHost Linux
          ;;
    *)
    echo "不支持的操作系统 ❌❌❌"
    exit 1
    ;;
esac