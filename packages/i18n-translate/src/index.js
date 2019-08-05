/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {promisify} from 'util';
import cheerio from 'cheerio';
import yaml from 'js-yaml';
import {flattenObj} from './flatten';
import {json2csv, merge} from './convert';
import md5 from 'js-md5';

const ROOT = path.join(__dirname, '../source');
const EFFECTEXT = ['.vue', '.yaml'];

let container = [];
console.log(process.argv);

/**
 * translate 把所有涉及翻译相关导出成一份CSV
 */
async function generateCSV() {
    const data = await getJSON(ROOT);
    const csv = json2csv(data);
    // console.log(csv)
    const writeFile = promisify(fs.writeFile);
    await writeFile(path.resolve(__dirname, './result.csv'), csv);

    console.log('write csv success');
}

/**
 * 修改完的新CSV，再覆盖原先代码
 * 1. pull一份本地csv
 * 2. merge(local, new)
 */
function feed() {
    const csvDataLocal = fs.readFileSync(path.resolve(__dirname, './result.copy.csv'), 'utf8');
    const csvDataNew = fs.readFileSync(path.resolve(__dirname, './result.csv'), 'utf8');

    const [localFields, ...localContent] = csvDataLocal.split('\r\n');
    const [newFields, ...newContent] = csvDataNew.split('\r\n');
    // console.log(content);
    


    const localData = merge(localContent);
    const newData = merge(newContent);
    // console.log(JSON.stringify(newData))

    // step3: hash 看看block前后csv有木有变化
    // 判断有无变化也挺脏的，还不如每个文件都写一遍
    // 但写文件过程容易出错，写多了出了问题不好改
    // 寻思着这一步不能省略

    Object.entries(newData).forEach(([key, newValue]) => {
        const localValue = localData[key];

        // 这个文件毫无改动
        if (localValue && md5(JSON.stringify(newValue)) === md5(JSON.stringify(localValue))) {
            delete newData[key];
        }
    });
    console.log(newData);
    // step4: 写文件
}

async function getJSON(dir) {
    // const readDir = promisify(fs.readdir);
    const dirContent = fs.readdirSync(dir);  // ['vue', 'static', 'a.js']

    dirContent.forEach(async item => {
        // const stat = promisify(fs.stat);
        const stats = fs.statSync(dir + '/' + item);
        if (stats.isDirectory()) {
            getJSON(dir + path.sep + item);
        }
        else {
            // console.log(path.extname(dir + '/' + item));
            const ext = path.extname(dir + '/' + item);

            if (ext === '.vue') {
                // const getFileContent = promisify(fs.readFile);
                const vueTemplate = fs.readFileSync(dir + '/' + item, 'utf8');
                const $ = cheerio.load(vueTemplate);
                const json = yaml.safeLoad($('i18n').text());

                // 解析json
                handleFilter(json, dir + path.sep + item);
            }

            if (ext === '.yaml') {
                // console.log(dir + '/' + item)
                // const getFileContent = promisify(fs.readFile);
                const yamlContent = fs.readFileSync(dir + '/' + item, 'utf8');
                const json = yaml.safeLoad(yamlContent);

                handleFilter(json, dir + path.sep + item);
            }
        }
    });

    return container;
}

function handleFilter(json, path) {
    json.en = json.en && typeof json.en === 'object' ? json.en : {};

    Object.keys(json.cn).forEach(key => {
        const flattenResultCN = flattenObj({[key]: json.cn[key]});
        const flattenResultEN = flattenObj({[key]: json.en[key]});

        Object.entries(flattenResultCN).forEach(([cnKey, cnVal]) => {
            if (!flattenResultEN[cnKey]) {
                container.push(
                    {lang: 'cn', path, key: 'cn.' + cnKey, value: cnVal},
                    {lang: 'en', path, key: 'en.' + cnKey, value: ''}
                );
            }
        });
    });
}

export {
    generateCSV,
    feed
};
