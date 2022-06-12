const Handlebars = require("handlebars");
const path = require('path')
const fs = require('fs-extra')

function generatorPackageJson(projectDir, inputObj) {
    const packagePath = path.resolve(projectDir, 'package.json')
    const content = fs.readFileSync(packagePath, 'utf-8')
    const template = Handlebars.compile(content);
    const fileContent = template(inputObj)
    fs.writeFileSync(packagePath, fileContent)
}

module.exports = generatorPackageJson