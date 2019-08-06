import fs from 'fs';
import path from 'path';
import {flattenObj} from './flatten';
import loadI18n from './loadI18n';

const EFFECTEXT = ['.vue', '.yaml'];
const container = [];

export default async function getJSON(dir) {
    const dirContent = fs.readdirSync(dir);  // ['vue', 'static', 'a.js']

    dirContent.forEach(async item => {
        // const stat = promisify(fs.stat);
        const dirItemName = dir + path.sep + item;
        const stats = fs.statSync(dirItemName);
        if (stats.isDirectory()) {
            getJSON(dirItemName);
        }
        else {
            const ext = path.extname(dirItemName);

            if (EFFECTEXT.includes(ext)) {
                const json = loadI18n(dirItemName);
                // 解析json
                handleFilter(json, dirItemName);
            }
        }
    });

    return container;
};

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
