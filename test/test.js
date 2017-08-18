require('../index')

const path = require('path')

const MiniServer = require('bcore/lib/mini-server-center')

process.on('unhandledRejection', (reason, p) => {
    console.warn('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})


let miniServerPromise = MiniServer.load('testApp', 'email', {
    //发送回邮件的附件根目录
    attachRoot: process.cwd(),
    from: 'zpli_buns@126.com',
    auth: {
        user: '账号',
        pass: '密码'
    },
    host: 'smtp.126.com',
    port: 465,
    secure: true, //
    pool: false
})


class Email {
    constructor() {}

    async sendPlainTest() {

        let rslt = await this.msrv.email.sendPlain('Hello world√', '727909373@qq.com', 'Hello world')

        console.log(rslt)

        return rslt
    }

    async sendHtmlTest() {

        let rslt = await this.msrv.email.sendHtml('Hello world√', '727909373@qq.com', '<div><a href="https://www.baidu.com" target="_blank">百度</a></div>')

        console.log(rslt)

        return rslt
    }

    async sendTplHtmlTest() {

        let rslt = await this.msrv.email.sendTplHtml('Hello world√', '727909373@qq.com', path.join(__dirname, './test.html'), {
            title: '百度'
        })

        return rslt
    }

    async sendMarkdown() {

        let rslt = await this.msrv.email.sendTplHtml('Hello world√', '727909373@qq.com', path.join(__dirname, './test.md'), {
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: true,
            sanitize: true,
            smartLists: true,
            smartypants: true
        })

        console.log('markdown email content:', rslt)

        return rslt
    }
}

let obj = new Email()

miniServerPromise.then(() => {
    MiniServer.injection('testApp', obj)

    // obj.sendPlainTest()

    // obj.sendHtmlTest()

    //obj.sendTplHtmlTest()

    obj.sendMarkdown()
})