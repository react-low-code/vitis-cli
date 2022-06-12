const prompts = require('prompts');
const validate = require("validate-npm-package-name")

const questions = [
    {
        type: 'text',
        name: 'componentName',
        message: '请输入组件英文名，例如: WarningText'
    },
    {
        type: 'confirm',
        name: 'confirmDir',
        message: (prev) => `项目将创建在 vitis-lowcode-${prev.toLocaleLowerCase().trim()} 目录，你确定吗？`,
        initial: true
    },
    {
        type: (prev) => prev === true ? 'text' : null,
        name: 'componentTitle',
        message: '请输入组件中文名，例如: 警告文本'
    }
]



async function start() {
    const response = await prompts(questions)
    if (response.confirmDir) {
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
    } else {
        return Promise.reject()
    }
}

module.exports = start