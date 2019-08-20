import * as d3 from 'd3';
import {Matrix} from 'transformation-matrix-js';
import geoJson from './vendor/china.json';
import {dots} from './city';

// const matrix = new Matrix(context)
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = '1000';
ctx.canvas.height = '400';

const context = d3.select('#canvas').node().getContext('2d');

const projection = d3
    .geoEquirectangular()
    .scale(600)
    .translate([500, 200])
    .center([104, 36]);

const geoGenerator = d3.geoPath().projection(projection).context(context);

function start() {
    generateMap();
    generateDot();
    console.log(context)
    setTimeout(() => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        console.log(context)
    }, 2000);
}

function generateMap() {
    context.lineWidth = 1;
    context.strokeStyle = '#aaa';
    context.beginPath();
    geoGenerator({
        type: 'FeatureCollection',
        features: geoJson.features
    });
    context.stroke();
}

function generateDot() {
    context.strokeStyle = '#FF0000';
    context.beginPath();
    geoGenerator({
        type: 'FeatureCollection',
        features: dots.features
    });
    context.scale(6, 6);
    context.fillStyle = '#FF0000';
    context.fill();

    context.stroke();
}

start();
