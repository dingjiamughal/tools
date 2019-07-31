import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import {promisify} from 'util';
import cheerio from 'cheerio';
import yaml from 'js-yaml';
import {Parser} from 'json2csv';
import {flattenObj, unflattenObj} from './flatten';

const ROOT = path.join(__dirname, '../source');
const EFFECTEXT = ['.vue', '.yaml'];

let container = [];

/**
 * translate 把所有涉及翻译相关导出成一份CSV
 */
async function generateCSV() {
    const data = await getJSON(ROOT);

    const fields = ['lang', 'path', 'key', 'value'];
    const json2csvParser = new Parser({fields});
    const csv = json2csvParser.parse(data);
    const writeFile = promisify(fs.writeFile);
    await writeFile(path.resolve(__dirname, './result.csv'), csv);

    console.log('write csv success');
}

/**
 * 修改完的新CSV，再覆盖原先代码
 */
function feed() {
    const csvData = fs.readFileSync(path.resolve(__dirname, './result.csv'), 'utf8');
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
                json.en = _.merge(json.en, json.cn);
                const flattenResult = flattenObj(json);
                Object.entries(flattenResult).forEach(([key, value]) => {
                    container.push({
                        lang: key.substr(0, 2),
                        path: dir + path.sep + item,
                        key,
                        value
                    });
                });
            }

            if (ext === '.yaml') {
                // console.log(dir + '/' + item)
                // const getFileContent = promisify(fs.readFile);
                const yamlContent = fs.readFileSync(dir + '/' + item, 'utf8');
                const json = yaml.safeLoad(yamlContent);

                json.en = _.merge(json.en, json.cn);
                const flattenResult = flattenObj(json);
                Object.entries(flattenResult).forEach(([key, value]) => {
                    container.push({
                        lang: key.substr(0, 2),
                        path: dir + path.sep + item,
                        key,
                        value
                    });
                });
            }
        }
    });

    return container;
}


export {
    generateCSV,
    feed
};
