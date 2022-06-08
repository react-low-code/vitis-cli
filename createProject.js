'use strict';
const commander = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const path = require('path');
const semver = require('semver');
const spawn = require('cross-spawn');
const prompts = require('prompts');
const fs = require('fs-extra')
const utils = require('./utils')

const packageJson = require('./package.json');
let projectName

function init() {
    const program = new commander.Command();
    program.command('create')
    .argument('<project-directory>','项目所在目录')
    .action((str) => {
        projectName = str
    })
    .allowUnknownOption()

    program.parse();

    if (!projectName) {
        console.error('Please specify the project directory:');
        console.log('For example:');
        console.log(
            `  ${chalk.cyan('vitis-cli create')} ${chalk.green('my-component')}`
        );

        process.exit(1);
    }

    const source = path.resolve(__dirname, 'template')
    const destination = path.resolve(process.cwd(), projectName)

    utils.isExitDir(destination)
    .then(isExitDir => {
        if (isExitDir) {
            return utils.isEmptyDir(destination)
        }

        return true
    })
    .then(isEmpty => {
        if (isEmpty) {
            try {
                fs.copySync(source, destination)
            } catch (error) {
                console.log('An error occured while copying the folder.') 
                console.error(chalk.red(error)) 
            }
        } else {
            console.error(
                `${chalk.red(destination + ' 不是空目录')}`
            );
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error(
            `${chalk.red(error)}`
        );
        process.exit(1);
    })

    
}

module.exports = {
    init
}