const prompts = require('prompts');
const validate = require("validate-npm-package-name")

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

module.exports = {
    create: create,
    add: add
}