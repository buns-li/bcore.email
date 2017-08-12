const template = require('art-template')
const fs = require('fs')

module.exports.render = function(fileUrl, context) {

    return new Promise((resolve, reject) => {

        fs.readFile(fileUrl, (err, data) => {

            if (err) return reject(err)

            return resolve(template.render(data.toString(), context))

        })

    })
}