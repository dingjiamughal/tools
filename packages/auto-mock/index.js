const fs = require('fs');
const path = require('path');
const util = require('util');
const yaml = require('js-yaml');
const Mock = require('mockjs');
const yargs = require('yargs');

const {entry, output} = yargs.argv;

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// adp
async function start() {
    const fileContent = await readFile(path.resolve('.', entry), 'utf8');
    const yamlResult = yaml.safeLoad(fileContent);

    const result = Object
        .entries(yamlResult)
        .reduce((memo, [url, {description, response, request}]) => {
            memo.push({
                url,
                description,
                request,
                response: Mock.mock(response)
            });
            return memo;
        }, []);

    // console.log(JSON.stringify(result));
    const template = await readFile(path.resolve(__dirname, './dev/template.js'), 'utf8');
    const injectTemplate = template.replace('"<%INJECT%>"', JSON.stringify({nodeList: result}));
    await writeFile(path.resolve('.', output), injectTemplate, 'utf8');
    console.log('write completed!');
}

start();
