# bcore.email

bcore微服务---邮件发送

1. 基于`bcore`组件
1. 依赖[nodemailer](https://github.com/nodemailer/nodemailer)
1. 支持文本传输
1. 支持附件传输
1. 支持`html`内容传输
1. 支持模板引擎编译后传输
1. 支持`Markdown`文件传输

## Options

* `debug`: [`Boolean`] 是否开启调试 (Default:`false`)
* `logger`: [`Boolean`] 是否开启日志 (Default:`false`)
* `from`: [`String`] 发送方邮箱地址
* `auth`: [`Object-Hash`] 发送方账户信息
* `host`: [`String`] 邮件服务器主机名 (Default:`smtp.126.com`)
* `port`: [`Number`] 发送端口(Default:`465`)
* `secure`: [`Boolean`] 内容开启传输开关(Default:`true`)
* `pool`: [`Boolean`] 是否使用邮件发送池(Default:`false`)

## Method

**sendPlain(subject,reciever,text,attachments)**:发送文本

* `subject`: [`String`] 邮件主题
* `reciever`: [`String`|`Object`] 邮件接收方
* `text`: [`String`] 邮件正文(纯文本)
* `attachments`:[`Array`] 邮件附件 *Optional*

**sendHtml(subject,reciever,html,attachments)**:发送Html

* `subject`: [`String`] 邮件主题
* `reciever`: [`String`|`Object`] 邮件接收方
* `html`: [`String`] 邮件正文(html字符串)
* `attachments`:[`Array`] 邮件附件 *Optional*

**sendTplHtml(subject,reciever,tplFile,tplContext,attachments)**:发送html模板

* `subject`: [`String`] 邮件主题
* `reciever`: [`String`|`Object`] 邮件接收方
* `fileUrl`: [`String`] 邮件模板文件地址
* `tplContext`:[`Object`] 邮件模板填充的上下文
* `attachments`:[`Array`] 邮件附件 *Optional*

**Note:**

1. `attachments`的传入格式如下:

```js
[
    {   // utf-8 string as an attachment
        filename: 'text1.txt',
        content: 'hello world!'
    },
    {   // binary buffer as an attachment
        filename: 'text2.txt',
        content: new Buffer('hello world!','utf-8')
    },
    {   // file on disk as an attachment
        filename: 'text3.txt',
        path: '/path/to/file.txt' // stream this file
    },
    {   // filename and content type is derived from path
        path: '/path/to/file.txt'
    },
    {   // stream as an attachment
        filename: 'text4.txt',
        content: fs.createReadStream('file.txt')
    },
    {   // define custom content type for the attachment
        filename: 'text.bin',
        content: 'hello world!',
        contentType: 'text/plain'
    },
    {   // use URL as an attachment
        filename: 'license.txt',
        path: 'https://raw.github.com/nodemailer/nodemailer/master/LICENSE'
    },
    {   // encoded string as an attachment
        filename: 'text1.txt',
        content: 'aGVsbG8gd29ybGQh',
        encoding: 'base64'
    },
    {   // data uri as an attachment
        path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
    },
    {
        // use pregenerated MIME node
        raw: 'Content-Type: text/plain\r\n' +
                'Content-Disposition: attachment;\r\n' +
                '\r\n' +
                'Hello world!'
    }
]
```

1. `reciever` 的格式有两种

只有接收人的情况:

```js
 reciever: 'zpli_buns@126.com'
```

存在抄送人、密送人

```json
    "reciever":{
        "to":"接收人邮箱地址",
        "cc":"抄送人邮箱地址",
        "bcc":"密送人邮箱地址"
    }
```

## 支持的模板引擎

>利用文件后缀名判别使用哪个模板引擎

1. [ejs](https://github.com/mde/ejs): `.ejs`
1. [hbs](https://github.com/wycats/handlebars.js): `.hbs`
1. [nunjucks](https://github.com/mozilla/nunjucks): `.njk | .html`
1. [pug](https://github.com/pugjs/pug): `.jade | .pug`
1. [dot](https://github.com/olado/doT): `.dot`
1. [artTemplate](https://github.com/aui/art-template): `.art`

## Markdown Transport

在组件内部被归纳到了模板引擎一类执行处理,对应如下:

1. [Markdown](https://github.com/chjj/marked): `.md | .markdown`

## Test

目前只有简单测试,还没有依托在`mocha`和`should`基础上的BDD测试

```sh
npm run test
```