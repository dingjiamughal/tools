export function json2csv(json) {
    const array = typeof json === 'object' ? json : JSON.parse(json);

    const quotaMark = code => `"${code}"`;

    let text = Object.keys(array[0]).reduce((memo, next, index) => {
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
        text += line + lineSuffix;
    });

    return text;
}
