const fs = require('fs-extra')

async function isExitDir(pathStr) {
    const isExit = await isFileExit(pathStr)
    if (isExit) {
        const stats = fs.statSync(pathStr)
        return stats.isDirectory()
    } else {
        return false
    }
}

async function isEmptyDir(pathStr) {
    if (isExitDir(pathStr)) {
        items = await fs.readdir(pathStr)
        return items.length === 0
    } else {
        return Promise.reject('目录不存在')
    }
}

function isFileExit(pathStr) {
    return new Promise((resolve) => {
        fs.access(pathStr, (err) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
}

async function getSubDirs(pathStr) {
    if (!await isEmptyDir(pathStr)) {
        const items = await fs.readdir(pathStr)

        return items
    }
}

module.exports = {
    isExitDir,
    isEmptyDir,
    getSubDirs
}