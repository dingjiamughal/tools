import {unflattenObj} from './flatten';
import _ from 'lodash';

export function json2csv(json) {
    const array = typeof json === 'object' ? json : JSON.parse(json);

    const quotaMark = code => `"${code}"`;

    let csv = Object.keys(array[0]).reduce((memo, next, index) => {
        const suffix = index === Object.keys(array[0]).length - 1 ? '\r\n' : ',';
        memo += quotaMark(next) + suffix;
        return memo;
    }, '');

    array.forEach((item, idx) => {
        const line = Object.values(item).reduce((memo, next, index) => {
            const suffix = index === Object.values(item).length - 1 ? '' : ',';
            memo += quotaMark(next) + suffix;
            return memo;
        }, '');

        const lineSuffix = idx === array.length - 1 ? '' : '\r\n';
        csv += line + lineSuffix;
    });

    return csv;
}

export function merge(content) {
    const stringParser = str => str.replace(/"/g, '');

    // step1 => [{path, key: value}, ...]
    const array = content.reduce((memo, next) => {
        const valItem = next.split(','); // lang path key value
        memo.push({
            path: stringParser(valItem[1]),
            [stringParser(valItem[2])]: stringParser(valItem[3])
        });
        return memo;
    }, []);

    // 此时一个key value为一个block
    // 希望文件只write一次

    // step2 => 
    // {
    //     fileName1: {cn: ..., en: ...},
    //     fileName2: {cn: ..., en: ...}
    // }
    const fileArr = array.reduce((memo, next) => {
        const {path, ...rest} = next;
        const hasKey = memo[path]; // 看一下大容器里有没有这个 filename

        if (!hasKey) { // 如果没有这个文件，就直接添加
            memo[path] = {...unflattenObj(rest)};
        }
        else { // 如果有这个文件，把它添加到指定地方
            memo[path] = _.merge(memo[path], unflattenObj(rest));
        }
        return memo;
    }, {});
    //todo: 排序 万一翻译的时候哪个hape把顺序改了那内容没改，这样进行md5的结果是内容变化了

    return fileArr;
}
