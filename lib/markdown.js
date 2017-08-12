'use strict'

const marked = require('marked')

const fs = require('fs')

module.exports.render = function render(fileUrl, options) {

    let setOptions = Object.assign({}, {
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false
    }, options)

    return new Promise((resolve, reject) => {
        fs.readFile(fileUrl, 'utf-8', (err, data) => {
            if (err) return reject(err)
            marked(data, setOptions, (err2, output) => err2 ? reject(err2) : resolve(output))
        })
    })
}