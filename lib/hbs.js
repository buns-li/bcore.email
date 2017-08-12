const hbs = require('handlebars')
const fs = require('fs')

module.exports.render = function(fileUrl, context) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileUrl, (err, chunk) => {
            err ? reject(err) : resolve(hbs.compile('{{foo}}')({}))
        })
    })
}