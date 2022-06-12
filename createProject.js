'use strict';
const commander = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const path = require('path');
const semver = require('semver');
const spawn = require('cross-spawn');
const download = require('download-git-repo')
const fs = require('fs-extra')

const utils = require('./utils')
const startPrompts = require('./prompts')
const generatorPackageJson = require('./generator/packageJson')
const generatorMarkdown = require('./generator/markdown')
const generatorUmirc = require('./generator/umirc')

async function verifyDir(destination) {
    const isExitDir = await utils.isExitDir(destination)
    if (isExitDir) {
        const isEmpty = await utils.isEmptyDir(destination)

        if (!isEmpty) {
            throw `请确保 ${destination} 不存在或者是空目录`
        }
    }
}


const repo = 'direct:https://github.com/react-low-code/vitis-component-template.git#master'
const tmpDir = path.resolve(process.cwd(), 'tmp')

async function downloadTemplateToTarget(userAnswer) {
    const destination = path.resolve(process.cwd(), userAnswer.projectName)
    await verifyDir(destination)

    return new Promise((resolve, reject) => {
        console.log(`${chalk.green('开始下载模板...')}`);
        download(repo, tmpDir,{
            clone: true
        }, (err) => {
            if (err) {
                reject('项目模板下载失败 ->' + err)
            } else {
                const source = path.resolve(tmpDir, 'template')
                fs.copySync(source, destination, {
                    recursive: true
                })
                fs.removeSync(tmpDir)
                resolve(destination)
            }
        })
    })
    
}

function init() {
    const program = new commander.Command();
    program.command('create')
    .action(() => {
        (async () => {
            try {
                const userAnswer = await startPrompts()
                const destination = await downloadTemplateToTarget(userAnswer)
                generatorPackageJson(destination, userAnswer)
                generatorMarkdown(destination, userAnswer)
                generatorUmirc(destination, userAnswer)
            } catch (error) {
                if (error) {
                    console.error(
                        `${chalk.red(error)}`
                    );
                }
                process.exit(1);
            }
        })()
    })
    .allowUnknownOption()

    program.parse();
}

module.exports = {
    init
}