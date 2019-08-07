/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {promisify} from 'util';
import cheerio from 'cheerio';
import yaml from 'js-yaml';
import shell from 'shelljs';
import {json2csv, merge} from './convert';
import md5 from 'js-md5';
import getJSON from './get';

const ROOT = path.resolve('.', process.argv[3]);
const exportPath = path.resolve('.', process.argv[4], process.argv[5]);


/**
 * translate 把所有涉及翻译相关导出成一份CSV
 */
export async function generateCSV() {
    const data = await getJSON(ROOT);
    const csv = json2csv(data);
    // console.log(csv)
    const writeFile = promisify(fs.writeFile);
    await writeFile(exportPath, csv);
}

/**
 * 修改完的新CSV，再覆盖原先代码
 * 1. pull一份本地csv
 * 2. merge(local, new)
 */
export function feed() {
    const importPath = path.resolve('.', process.argv[4], process.argv[6]);

    const csvDataLocal = fs.readFileSync(exportPath, 'utf8');
    const csvDataNew = fs.readFileSync(importPath, 'utf8');

    const [localFields, ...localContent] = csvDataLocal.split('\r\n');
    const [newFields, ...newContent] = csvDataNew.split('\r\n');
    // console.log(content);
    const hash = obj => md5(JSON.stringify(obj));

    const localData = merge(localContent);
    const newData = merge(newContent);
    // console.log(JSON.stringify(newData))

    // hash 看看block前后csv有木有变化
    Object.entries(newData).forEach(([key, newValue]) => {
        const localValue = localData[key];

        // 文件有变动，需要覆盖
        if (hash(newValue) !== hash(localValue)) {
            const html = fs.readFileSync(key, 'utf8');
            const $ = cheerio.load(html);
            const json = yaml.safeLoad($('i18n').text());
            const newI18nYAML = yaml.safeDump(_.merge(json, newValue));
            const newI18n = `<i18n>\r\n${newI18nYAML}\r\n</i18n>`;

            // shell.sed('-i', /<i18n.*?>([\s\S]+?)<\/i18n>/, newI18nYAML, key); // 不知道为啥不行??-?? sad!
            const newHTML = shell.cat(key).replace(/<i18n.*?>([\s\S]+?)<\/i18n>/, newI18n);
            fs.writeFileSync(key, newHTML);
        }
        // else { // 用于调试newData
        //     delete newData[key];
        // }
    });
    // console.log(newData);
}
