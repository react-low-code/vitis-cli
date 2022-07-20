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
const prompts = require('./prompts')
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

async function downloadTemplateToTarget(des) {
    const destination = path.resolve(process.cwd(), des)
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

function generatorComponent(componentDestination, userAnswer) {
    generatorPackageJson(componentDestination, userAnswer)
    generatorMarkdown(componentDestination, userAnswer)
    generatorUmirc(componentDestination, userAnswer)
}

function init() {
    const program = new commander.Command();
    program
    .command('create')
    .action(() => {
        (async () => {
            try {
                const userAnswer = await prompts.create()
                const projectDestination = await downloadTemplateToTarget('vitis-component-packages')
                const componentDestination = path.resolve(projectDestination ,'packages' ,userAnswer.componentName)

                fs.renameSync(path.resolve(projectDestination ,'packages' ,'example'), componentDestination)
                generatorComponent(componentDestination, userAnswer)
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

    program
    .command('add')
    .action(() => {
        (async () => {
            try {
                const userAnswer = await prompts.add()
                const componentTargetDestination = path.resolve(process.cwd(), 'packages', userAnswer.componentName)
                await verifyDir(componentTargetDestination)
                
                const projectDestination = await downloadTemplateToTarget('___temp__')
                const componentOriginDestination = path.resolve(projectDestination ,'packages' ,userAnswer.componentName)

                fs.renameSync(path.resolve(projectDestination ,'packages' ,'example'), componentOriginDestination)
                
                fs.moveSync(componentOriginDestination, componentTargetDestination)
                fs.removeSync(projectDestination)
                generatorComponent(componentTargetDestination, userAnswer)
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