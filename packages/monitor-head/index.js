/* eslint-disable no-console */
const https = require('https');
const fs = require('fs');
const {resolve} = require('path');
const cheerio = require('cheerio');
const yaml = require('js-yaml');
const nodeMailer = require('nodemailer');

const MAPPING = yaml.safeLoad(fs.readFileSync(resolve(__dirname, './data.yml'), 'utf-8'));
const prefix = 'https://ai.baidu.com/easydl/';
const routes = [
    {name: 'index', url: prefix + '/'},
    {name: 'case', url: prefix + '/case'},
    {name: 'image', url: prefix + '/image'},
    {name: 'sound', url: prefix + '/sound'},
    {name: 'text', url: prefix + '/text'},
    {name: 'video', url: prefix + '/video'},
    {name: 'retail', url: prefix + '/retail'}
];
const MAILMAPPING = {
    host: 'smtp.qq.com',
    from: '465560882@qq.com',
    to: '465560882@qq.com',
    pass: 'uzhqnnofdespcajd'
};
let safeStatus = false;

start();
async function start() {
    let TIMEOUT = 1000 * 60 * 20;
    const errorMsg = [];

    const result = await Promise.all(
        routes.map(route => (getHTML(route.url)))
    );
    result.forEach((item, index) => {
        routes[index].html = item;
    });

    routes.forEach(({name, html}) => {
        const $ = cheerio.load(html);

        const title = $('title').text();
        const keywords = $('meta[name="keywords"]').attr('content');
        const description = $('meta[name="description"]').attr('content');

        if (title !== MAPPING[name].title) {
            console.log(name, 'title');
            errorMsg.push(`
                <strong>页面名称：</strong>${name} --- title</br>
                <strong>错误内容：</strong>${title}</br>
                <strong>正确内容：</strong>${MAPPING[name].title}</br>
                -----------------------
            `);
        }

        if (keywords !== MAPPING[name].keywords) {
            console.log(name, 'keywords');
            errorMsg.push(`
                <strong>页面名称：</strong>${name} --- keywords</br>
                <strong>错误内容：</strong>${keywords}</br>
                <strong>正确内容：</strong>${MAPPING[name].keywords}</br>
                -----------------------
            `);
        }

        if (description !== MAPPING[name].description) {
            console.log(name, 'description');
            errorMsg.push(`
                <strong>页面名称：</strong>${name} --- description</br>
                <strong>错误内容：</strong>${description}</br>
                <strong>正确内容：</strong>${MAPPING[name].description}</br>
                -----------------------
            `);
        }
    });

    const nowHours = new Date().getHours();
    if (nowHours === 8 && safeStatus) {
        safeStatus = false;
    }

    if (errorMsg.length > 0) {
        sendMail(errorMsg.join('</br>'));
    }

    else if (nowHours === 17 && !safeStatus) {
        sendMail('all success', 'success');
        safeStatus = true;
    }

    if (nowHours >= 22 || nowHours <= 9) {
        TIMEOUT = 1000 * 60 * 60;
    }

    let timer = setTimeout(() => {
        start();
        clearTimeout(timer);
    }, TIMEOUT);
}

function getHTML(url) {
    let html = '';

    return new Promise((resolve, reject) => {
        https.get(url, res => {
            res.on('data', data => {
                html += data;
            });
            res.on('end', () => {
                resolve(html);
            });
            res.on('error', e => {
                console.error(e);
            });
        });
    });
}

async function sendMail(html, type = 'warning') {
    const transporter = nodeMailer.createTransport({
        host: MAILMAPPING.host,
        port: 587,
        secure: false,
        auth: {
            user: MAILMAPPING.from,
            pass: MAILMAPPING.pass // 1069070069 配置邮件客户端
        }
    });

    const mailOptions = {
        from: `${type} ${MAILMAPPING.from}`,
        to: MAILMAPPING.to,
        subject: 'easydl 报警！',
        html
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            // return;
        }
    });
}
