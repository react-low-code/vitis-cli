const Handlebars = require("handlebars");
const path = require('path')
const fs = require('fs-extra')

function generatorUmirc(projectDir, inputObj) {
    const umircPath = path.resolve(projectDir, '.umirc.ts')
    const content = fs.readFileSync(umircPath, 'utf-8')
    const template = Handlebars.compile(content);
    const fileContent = template(inputObj)
    fs.writeFileSync(umircPath, fileContent)
}

module.exports = generatorUmirc