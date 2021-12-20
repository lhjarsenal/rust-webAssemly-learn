// import * as wasm from "hello-wasm-pack";
// wasm.greet();

// import {
//     Universe
// } from "wasm-gamo-of-life";
//
// const pre = document.getElementById("game-of-life-canvas");
// const universe = Universe.new();
//
// function renderLoop() {
//     pre.textContent = universe.render();
//     universe.tick();
//     window.requestAnimationFrame(renderLoop);
// }
//
// window.requestAnimationFrame(renderLoop);

import {Universe, Cell} from "wasm-gamo-of-life";
import {memory} from "wasm-gamo-of-life/wasm_gamo_of_life_bg.wasm";

const CELL_SIZE = 5; //px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const universe = Universe.new();
const width = universe.width();
const height = universe.height();

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

let animationId = null;

function renderLoop() {
    //debugger; //添加调试器
    drawGrid();
    drawCells();
    universe.tick();
    //window.requestAnimationFrame(renderLoop);
    animationId = requestAnimationFrame(renderLoop);
}

function isPaused() {
    return animationId === null;
}

const playPauseButton = document.getElementById("play-pause");

function play() {
    playPauseButton.textContent = "⏸";
    renderLoop();
}

function pause() {
    playPauseButton.textContent = "▶️";
    cancelAnimationFrame(animationId);
    animationId = null;
}


function drawGrid() {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);

    }

    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
}

function getIndex(row, col) {
    return row * width + col;
}

function drawCells() {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);
            ctx.fillStyle = cells[idx] === Cell.Dead ? DEAD_COLOR : ALIVE_COLOR;
            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE,
            );
        }
    }
    ctx.stroke();
}

window.requestAnimationFrame(renderLoop);

playPauseButton.addEventListener("click", function () {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
});

canvas.addEventListener("click", function () {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    universe.toggle_cell(row, col);

    drawGrid();
    drawCells();
});