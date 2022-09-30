const Handlebars = require("handlebars");
const fs = require('fs-extra');
const ts = require('typescript')
const kind = require('ts-is-kind')

const setterTpl = `
import React from 'react'

interface SetterCommonProps {
    value: any;
    onChange: (val: any) => void;
    field: SettingField;
    defaultValue: any;
}

interface SetterProps extends SetterCommonProps {
    // 在这里写设置器特有的props
    [attr: string]: any;
}

function {{setterName}}(props: SetterProps) {
    return (
        <div>我是属性设置器</div>
    )
}
{{setterName}}.displayName = '{{setterName}}'
export default {{setterName}}
`

function generatorSetter(fileName, inputObj) {
    const template = Handlebars.compile(setterTpl);
    const fileContent = template(inputObj)
    fs.writeFileSync(fileName, fileContent)
}

function exportSetter(settersExportFile, userAnswer) {
    const name = userAnswer.setterName
    let fileContent = `import ${name} from './${name}'\n` + fs.readFileSync(settersExportFile).toString()
    if (fileContent.search('export default') === -1) {
        fileContent += `export default {}`
    }
    
    function transformer(ctx){
        const visitor = (node) => {
            if (!kind.isExportAssignment(node)) {
                return ts.visitEachChild(node, visitor, ctx)
            } else {
                return updateExport(node, ctx)
            }
        }
        return (sf) => {
          return ts.visitNode(sf, visitor)
        }
    }

    function updateExport(node, ctx) {
        const visitor = node => {
            const newProperty = ts.factory.createShorthandPropertyAssignment(ts.factory.createIdentifier(name),)
            return ts.factory.updateObjectLiteralExpression(node,[newProperty].concat(node.properties))
        }
        return ts.visitEachChild(node, visitor, ctx)
    }
    const sourceFile = ts.createSourceFile('', fileContent, ts.ScriptTarget.ES2015,false);
    const result = ts.transform(sourceFile, [transformer]);
    const transformedSourceFile = result.transformed[0]
    const printer = ts.createPrinter()
    const resultCode = printer.printFile(transformedSourceFile)

    fs.writeFileSync(settersExportFile, resultCode)
}

module.exports = {
    generatorSetter,
    exportSetter
}