import {generateCSV, feed} from './src';

async function start() {
    await generateCSV();
    feed();
}

start();
