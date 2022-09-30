const path = require('path')
const fs = require('fs-extra')

module.exports = {
    exportSetter: function(componentDirs) {
        const entry = path.resolve(componentDirs,'src', 'index.ts')
        const content = fs.readFileSync(entry, 'utf-8')
        if (content.search('export { default as setters } from "./setters"') === -1) {

            fs.writeFileSync(entry,content + '\nexport { default as setters } from "./setters"')
        }
    }
}