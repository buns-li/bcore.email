const pug = require('pug')

const fs = require('fs')

module.exports.render = function render(fileUrl, context) {

    return new Promise((resolve, reject) => {
        fs.readFile(fileUrl, (err, data) => {
            return err ? reject(err) : resolve(pug.compile(data.toString())(context))
        })
    })
}