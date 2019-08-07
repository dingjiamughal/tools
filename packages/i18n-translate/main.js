import {generateCSV, feed} from './src';

const scene = process.argv[2];

if (scene === 'feed') {
    startFeed();
}

if (scene === 'generate') {
    generateCSV();
}

async function startFeed() {
    await generateCSV();
    feed();
}

