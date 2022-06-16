const Handlebars = require("handlebars");
const path = require('path')
const fs = require('fs-extra')

function generatorMarkdown(projectDir, inputObj) {
    const docPath = path.resolve(projectDir, 'src' ,'README.md')
    const content = fs.readFileSync(docPath, 'utf-8')
    const template = Handlebars.compile(content);
    const fileContent = template(inputObj)
    fs.writeFileSync(docPath, fileContent)
}

module.exports = generatorMarkdown