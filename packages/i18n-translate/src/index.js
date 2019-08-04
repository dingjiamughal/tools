import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {promisify} from 'util';
import cheerio from 'cheerio';
import yaml from 'js-yaml';
import {flattenObj, unflattenObj} from './flatten';
import {json2csv} from './convert';

const ROOT = path.join(__dirname, '../source');
const EFFECTEXT = ['.vue', '.yaml'];

let container = [];

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
 * 1. 找到
 */
function feed() {
    const csvDataPrev = fs.readFileSync(path.resolve(__dirname, './result.copy.csv'), 'utf8');
    const csvDataNew = fs.readFileSync(path.resolve(__dirname, './result.csv'), 'utf8');
    console.log(csvData);

    //csv2json

    // ...
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
        console.log(flattenResultCN);

        Object.entries(flattenResultCN).forEach(([cnKey, cnVal]) => {
            if(!flattenResultEN[cnKey]) {
                container.push({
                    lang: 'cn',
                    path,
                    key: cnKey,
                    value: cnVal
                },{
                    lang: 'en',
                    path,
                    key: cnKey,
                    value: ''
                });
            }
        });
    });
}

export {
    generateCSV,
    feed
};
