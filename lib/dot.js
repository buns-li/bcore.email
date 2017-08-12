const dot = require('dot')
const fs = require('fs')

module.exports.render = function(fileUrl, context) {

    return new Promise((resolve, reject) => {

        fs.readFile(fileUrl, (err, data) => {

            if (err) return reject(err)

            return resolve(dot.template(data.toString())(context))

        })

    })
}