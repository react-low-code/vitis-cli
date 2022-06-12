'use strict';
const commander = require('commander');
const chalk = require('chalk');
const execSync = require('child_process').execSync;
const path = require('path');
const semver = require('semver');
const spawn = require('cross-spawn');
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

async function copyDir(userAnswer) {
    const source = path.resolve(__dirname, 'template')
    const destination = path.resolve(process.cwd(), userAnswer.projectName)
    await verifyDir(destination)
    fs.copySync(source, destination)

    return destination
}

function init() {
    const program = new commander.Command();
    program.command('create')
    .action(() => {
        (async () => {
            try {
                const userAnswer = await startPrompts()
                const destination = await copyDir(userAnswer)
                generatorPackageJson(destination, userAnswer)
                fs.renameSync(path.resolve(destination,'gitignore'), path.resolve(destination,'.gitignore'))
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