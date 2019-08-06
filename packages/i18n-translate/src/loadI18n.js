import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import cheerio from 'cheerio';

export default fileName => {
    const template = fs.readFileSync(fileName, 'utf8');
    const ext = path.extname(fileName);

    if (ext === '.yaml') {
        return yaml.safeLoad(template);
    }

    const $ = cheerio.load(template);
    return yaml.safeLoad($('i18n').text());
};
