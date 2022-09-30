const prompts = require('prompts');
const validate = require("validate-npm-package-name")
const utils = require('./utils')
const path = require('path');

function formatResult(response) {
    const projectName = `vitis-lowcode-${response.componentName.toLocaleLowerCase().trim()}`;
    const validationResult = validate(projectName);

    if (!validationResult.validForNewPackages) {
        return Promise.reject(`${projectName} 不是合法的项目名`)
    }

    return Promise.resolve({
        componentName: response.componentName[0].toLocaleUpperCase() + response.componentName.slice(1),
        projectName: projectName,
        componentTitle: response.componentTitle.trim()
    })
}

async function create() {
    const questions = [
        {
            type: 'confirm',
            name: 'confirmDir',
            message: () => `项目将创建在 vitis-component-packages 目录，你确定吗？`,
            initial: true
        },
        {
            type: (prev) => prev === true ? 'text' : null,
            name: 'componentName',
            message: '请输入组件英文名，例如: WarningText'
        },
        {
            type: (prev) => !!prev ? 'text' : null,
            name: 'componentTitle',
            message: '请输入组件中文名，例如: 警告文本'
        }
    ]
    const response = await prompts(questions)
    if (response.confirmDir) {
        return formatResult(response)
    } else {
        return Promise.reject()
    }
}

async function add() {
    const questions = [
        {
            type: 'text',
            name: 'componentName',
            message: '请输入组件英文名，例如: WarningText'
        },
        {
            type: 'text',
            name: 'componentTitle',
            message: '请输入组件中文名，例如: 警告文本'
        }
    ]
    const response = await prompts(questions)
    return formatResult(response)
}

async function setter() {
    const componentDirs = await utils.getSubDirs(path.resolve(process.cwd(), 'packages'))
    if (!componentDirs || componentDirs.length === 0) {
        return Promise.reject('不存在组件，请先执行 vitis-cli add 命令添加一个组件')
    }
    const questions = [
        {
            type: componentDirs.length > 1 ? 'select': null,
            name: 'component',
            message: '选择组件，为该组件的属性开发设置器',
            choices: componentDirs.map(dirname => {
                return {
                    title: dirname,
                    value: path.resolve(process.cwd(), 'packages', dirname)
                }
            }),
        },
        {
            type: 'text',
            name: 'setterName',
            message: '请输入设置器名称，例如：SwitchSetter'
        }
    ]
    const response = await prompts(questions)
    if (!response.component) {
        response.component = path.resolve(process.cwd(), 'packages', componentDirs[0])
    }
    return response
}

module.exports = {
    create: create,
    add: add,
    setter
}