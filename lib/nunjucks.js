'use strict'

const nunjucks = require('nunjucks')

module.exports.render = function render(fileUrl, context) {
    return new Promise((resolve, reject) => {
        nunjucks.render(fileUrl, context, (err, output) => err ? reject(err) : resolve(output))
    })
}