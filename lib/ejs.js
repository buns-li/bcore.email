const ejs = require('ejs')

module.exports.render = function(fileUrl, context) {
    return new Promise((resolve, reject) => {
        ejs.renderFile(fileUrl, context, {
            cache: true,
            strict: true,
            rmWhitespace: true,
            escape: true
        }, (err, str) => err ? reject(err) : resolve(str))
    })
}