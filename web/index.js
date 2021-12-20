// import * as wasm from "hello-wasm-pack";
// wasm.greet();

import {
    Universe
} from "wasm-gamo-of-life";

const pre = document.getElementById("game-of-life-canvas");
const universe = Universe.new();

function renderLoop() {
    pre.textContent = universe.render();
    universe.tick();
    window.requestAnimationFrame(renderLoop);
}

window.requestAnimationFrame(renderLoop);