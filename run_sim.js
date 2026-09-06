const fs = require('fs');
let html = fs.readFileSync('app/src/main/assets/game.html', 'utf-8');
let scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (scripts.length >= 2) {
  let js = scripts[1];
  let wrapper = `
    const document = {
      getElementById: () => ({ style: {}, classList: { remove: ()=>{} }, addEventListener: ()=>{}, width: 800, height: 600, getContext: () => ({ font: '', fillStyle: '', fillRect: ()=>{}, save: ()=>{}, restore: ()=>{}, beginPath: ()=>{}, arc: ()=>{}, fill: ()=>{}, strokeStyle: '', strokeRect: ()=>{}, measureText: ()=>({width: 10}), clearRect: ()=>{}, fillText: ()=>{}, stroke: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, translate: ()=>{}, rotate: ()=>{}, scale: ()=>{}, globalAlpha: 1 }) }),
      querySelectorAll: () => ([]),
      createElement: () => ({ style: {}, classList: { add: ()=>{} }, appendChild: ()=>{}, width: 800, height: 600, getContext: () => ({ fillStyle: '', fillRect: ()=>{}, save: ()=>{}, restore: ()=>{}, beginPath: ()=>{}, arc: ()=>{}, fill: ()=>{}, strokeStyle: '', strokeRect: ()=>{}, clearRect: ()=>{}, fillText: ()=>{}, stroke: ()=>{}, moveTo: ()=>{}, lineTo: ()=>{}, translate: ()=>{}, rotate: ()=>{}, scale: ()=>{}, globalAlpha: 1 }) }),
      body: { appendChild: ()=>{} }
    };
    const window = { innerWidth: 800, innerHeight: 600, requestAnimationFrame: ()=>{}, addEventListener: ()=>{}, eventFlags: {} };
    const requestAnimationFrame = window.requestAnimationFrame;
    const performance = { now: () => 1000 };
    const Math = global.Math;
    const console = global.console;
    let localStorage = { getItem: ()=>{}, setItem: ()=>{} };
    const Image = function() {};
    const navigator = { vibrate: ()=>{} };
    const AudioContext = function() { this.createOscillator = () => ({ connect: ()=>{}, start: ()=>{}, stop: ()=>{}, type: '', frequency: { setValueAtTime: ()=>{} } }); this.createGain = () => ({ connect: ()=>{}, gain: { setValueAtTime: ()=>{}, exponentialRampToValueAtTime: ()=>{} } }); this.destination = {}; };
    try {
      ${js}
      console.log('Script parsed and executed globally without throwing errors.');
      startGame();
      console.log('startGame() called.');
      gameLoop();
      console.log('gameLoop() called.');
    } catch (e) {
      console.error(e.stack);
    }
  `;
  fs.writeFileSync('test_sim.js', wrapper);
  require('child_process').execSync('node test_sim.js', {stdio: 'inherit'});
}
