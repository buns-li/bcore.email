'use strict'

const path = require('path')
const nodemailer = require('nodemailer')
const bcore = require('bcore')

const slice = Array.prototype.slice

const engineMap = {
    '.njk': 'nunjucks',
    '.html': 'nunjucks',
    '.pug': 'jade',
    'jade': 'jade',
    '.dot': 'dot',
    '.jst': 'dot',
    '.art': 'artTemplate',
    '.ejs': 'ejs',
    '.hbs': 'hbs',
    '.md': 'markdown',
    '.markdown': 'markdown'
}

const confSymbol = Symbol['email#conf']

bcore.on('email', {
    //发送回邮件的附件根目录
    attachRoot: process.cwd(),
    from: '',
    auth: {},
    host: 'smtp.126.com',
    port: 465,
    secure: true, //
    pool: false,
    debug: false,
    logger: false
}, function() {
    /**
     * 构建发送邮件的邮件配置项
     *
     * @param {any} args 发送邮件的参数
     *   [0]: mail-contenttype: 'plain','html'
     *   [1]: subject
     *   [2]: reciever
     *   [3]: text|html
     *   [4]: attachments
     *
     *
     * @returns {Object} 邮件发送配置项
     */
    function createMailOptions(...args) {

        let opts = { subject: args[1] }

        args[4] && (opts.attachments = args[4])

        if (typeof args[2] === 'string') {
            opts.to = args[2]
        } else if (typeof args[2] === 'object') {
            opts.to = args[2].to
            args[2].cc && (opts.cc = args[2].cc)
            args[2].bcc && (opts.bcc = args[2].bcc)
        }

        switch (args[0]) {
            case 'html':
                opts.html = args[3]
                break
            case 'plain':
            default:
                opts.text = args[3]
                break
        }

        return opts
    }

    this.__init = function(options) {

        let conf = this[confSymbol] = {}

        options.attachRoot && (conf.attachRoot = path.normalize(options.attachRoot))

        options.from && (conf.from = options.from)

        conf.transport = nodemailer.createTransport({
            host: options.host,
            port: options.port,
            secure: !!options.secure, //强制转换成Boolean类型,
            auth: options.auth,
            pool: !!options.pool,
            debug: !!options.debug,
            logger: options.logger
        })
    }


    /**
     * 发送普通文本
     *
     * @param {String} subject 邮件主题
     * @param {String|Object} reciever 邮件的接收方
     *  当 `reciever` 为字符串的时候表示的是`to`邮件显示的接收方
     *  当 `reciever` 为对象的时候表示的是如下:
     *  {
     *    "to":"邮件接收方",
     *    "cc":"邮件抄送方",
     *    "bcc":"邮件密送方"
     *  }
     * @param {String} text 邮件正文文本
     * @param {Array|Object} 邮件附件
     *
     * @return {Promise<any>}
     */
    this.sendPlain = function(subject, reciever, text, attachments) {

        let conf = this[confSymbol]

        let args = slice.call(arguments)

        args.unshift('plain')

        let options = createMailOptions(...args)

        options.from = conf.from

        attachments && !Array.isArray(attachments) && (attachments = [attachments])

        attachments && attachments.length && (options.attachments = attachments)

        return conf.transport.sendMail(options)
    }

    /**
     * 发送html内容
     *
     * @param {String} subject 邮件主题
     * @param {String|Object} reciever 邮件的接收方
     *  当 `reciever` 为字符串的时候表示的是`to`邮件显示的接收方
     *  当 `reciever` 为对象的时候表示的是如下:
     *  {
     *    "to":"邮件接收方",
     *    "cc":"邮件抄送方",
     *    "bcc":"邮件密送方"
     *  }
     * @param {String} html 邮件的html内容
     * @param {Array|Object} 邮件附件
     *
     * @return {Promise<any>}
     */
    this.sendHtml = function(subject, reciever, htmlStr, attachments) {

        let conf = this[confSymbol]

        let args = slice.call(arguments)

        args.unshift('html')

        let options = createMailOptions(...args)

        options.from = conf.from

        attachments && !Array.isArray(attachments) && (attachments = [attachments])

        attachments && attachments.length && (options.attachments = attachments)

        return conf.transport.sendMail(options)
    }

    /**
     * 发送带模板引擎处理的html文件内容
     *
     * @param {String} subject 邮件主题
     * @param {String|Object} reciever 邮件的接收方
     *  当 `reciever` 为字符串的时候表示的是`to`邮件显示的接收方
     *  当 `reciever` 为对象的时候表示的是如下:
     *  {
     *    "to":"邮件接收方",
     *    "cc":"邮件抄送方",
     *    "bcc":"邮件密送方"
     *  }
     * @param {String} fileUrl 文件地址
     * @param {Object} tplContext 模板上下文数据或者是相关配置
     * @param {Array|Object} 邮件附件
     *
     * @return {Promise<any>}
     */
    this.sendTplHtml = async function(subject, reciever, fileUrl, tplContext, attachments) {

        let conf = this[confSymbol]

        let extname = path.extname(fileUrl)

        let renderer = require('./lib/' + engineMap[extname] || 'markdown')

        let parsedHtml = await renderer.render(fileUrl, tplContext)

        let args = ['html', subject, reciever, parsedHtml, attachments]

        let options = createMailOptions(...args)

        options.from = conf.from

        attachments && !Array.isArray(attachments) && (attachments = [attachments])

        attachments && attachments.length && (options.attachments = attachments)

        return conf.transport.sendMail(options)
    }
})