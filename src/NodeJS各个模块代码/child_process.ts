/**
在 Node.js 中，child_process 模块用于创建子进程，以便在 Node.js 应用程序中执行外部命令或脚本。它提供了一组 API，允许你与子进程进行交互、执行命令并处理子进程的输出。
child_process 模块提供了几个不同的方法来创建子进程，包括：
1、spawn()：用于异步地启动一个新的子进程，可以执行任意命令。
2、exec()：用于执行一个命令，并获取其输出。它使用系统的默认 shell 来执行命令。
3、execFile()：类似于 exec()，但直接执行可执行文件，而不使用系统的默认 shell。
4、fork()：用于创建一个新的 Node.js 子进程，并在该子进程中执行指定的模块文件。
 * */ 

import { exec } from 'child_process';


exec('ls -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`执行命令时出错: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`命令输出错误: ${stderr}`);
    return;
  }
  console.log(`命令输出结果:\n${stdout}`);
});
