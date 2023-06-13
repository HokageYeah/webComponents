/**
 * commander 是一个用于构建命令行应用的 Node.js 模块，
 * 它提供了一种简洁而直观的方式来定义命令行界面和解析命令行参数。
 * 它可以帮助你轻松地创建自定义命令、选项和子命令，并处理用户输入
 */

import { program } from "commander";

program
  .command("mycommand")
  .description("This is my custom command")
  .action((cmd) => {
    console.log("Executing mycommand");
    console.log("File:", cmd.file);
    console.log("Type:", cmd.type);
  });
program.parse(process.argv)