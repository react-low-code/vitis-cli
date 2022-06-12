const child_process = require('child_process');
const path = require('path')
const chalk = require('chalk');
const fatherBuild = path.resolve(process.cwd(),'node_modules','.bin','father-build')
const dumiBuild = path.resolve(process.cwd(),'node_modules','.bin','dumi')

function build() {
    /**组件打包 */
    console.log(`${chalk.green('开始打包组件')}`);
    child_process.execSync(fatherBuild)
    console.log(`${chalk.green('组件打包完成...，开始打包文档')}`);
    /**文档打包 */
    child_process.execSync(dumiBuild+' build')
    console.log(`${chalk.green('文档打包完成')}`);
}

function run() {
    build()
}

run()