
const window = global;
window.addEventListener = () => {};
window.innerWidth = 1080;
window.innerHeight = 2400;
window.devicePixelRatio = 2;
window.requestAnimationFrame = () => {};
const mockEl = () => ({
  style: {}, classList: { add: ()=>{}, remove: ()=>{} }, innerText: '', innerHTML: '', addEventListener: ()=>{},
  getContext: () => ({ setTransform: ()=>{}, restore: ()=>{}, save: ()=>{}, clearRect: ()=>{}, fillRect: ()=>{}, drawImage: ()=>{} })
});
const document = {
  getElementById: (id) => mockEl(),
  querySelectorAll: () => [mockEl()],
  querySelector: () => mockEl(),
  addEventListener: () => {},
  createElement: () => mockEl(),
};
const navigator = { userAgent: 'Android' };
const localStorage = { getItem: () => null, setItem: () => {} };
const performance = { now: () => 1000 };
const AudioContext = class { createOscillator(){return {type:'',frequency:{setValueAtTime:()=>{},setTargetAtTime:()=>{}},connect:()=>{},start:()=>{},stop:()=>{}};} createGain(){return {gain:{setValueAtTime:()=>{},exponentialRampToValueAtTime:()=>{},setTargetAtTime:()=>{}},connect:()=>{}};} };
const webkitAudioContext = AudioContext;


/* ==========================================================================
   DTA GRANICZNA 8F: MASSIVE HORDE SURVIVORS ENGINE WITH EVOLUTIONS & BOSSES
   ========================================================================== */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.motorOsc = null;
    this.motorGain = null;
    this.muted = false;
  }
  toggle() {
    this.muted = !this.muted;
    const btn = document.getElementById('btn-pause-sound');
    if (btn) btn.innerText = this.muted ? '🔇 DŹWIĘK: OFF' : '🔊 DŹWIĘK: ON';
    return this.muted;
  }
  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.setupEngineMotor();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }
  setupEngineMotor() {
    try {
      this.motorOsc = this.ctx.createOscillator();
      this.motorGain = this.ctx.createGain();
      this.motorOsc.type = 'triangle';
      this.motorOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
      this.motorGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.motorOsc.connect(this.motorGain);
      this.motorGain.connect(this.ctx.destination);
      this.motorOsc.start();
    } catch(e){}
  }
  updateMotor(speedRatio, isForklift = false) {
    if (!this.motorOsc || !this.motorGain || !this.ctx || this.muted) return;
    const t = this.ctx.currentTime;
    if (!isForklift) {
       this.motorGain.gain.setTargetAtTime(0.001, t, 0.2);
    } else {
       this.motorOsc.frequency.setTargetAtTime(45 + speedRatio * 80, t, 0.08);
       this.motorGain.gain.setTargetAtTime(0.01 + speedRatio * 0.025, t, 0.08);
    }
  }
  playTone(freq, type, duration, vol = 0.2, endFreq = null) {
    if (!this.ctx || this.muted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch(e){}
  }
  beep() { this.playTone(1100, 'sine', 0.05, 0.15, 1400); }
  hit() { this.playTone(120, 'sawtooth', 0.1, 0.2, 40); }
  pallet() { this.playTone(85, 'square', 0.18, 0.25, 30); }
  freeze() { this.playTone(650, 'sine', 0.2, 0.15, 1200); }
  megaph() { this.playTone(300, 'square', 0.25, 0.22, 180); }
  xp() { this.playTone(1400, 'sine', 0.05, 0.09, 1800); }
  dash() { this.playTone(220, 'sawtooth', 0.25, 0.25, 600); }
  footstep() { this.playTone(120, 'triangle', 0.06, 0.03, 80); }
  shatterProp() {
    this.playTone(160, 'square', 0.12, 0.25, 45);
    setTimeout(() => this.playTone(280, 'sawtooth', 0.15, 0.2, 80), 30);
  }
  chestSlot() {
    this.playTone(880, 'triangle', 0.08, 0.18, 1200);
  }
  chestFanfare() {
    [523, 659, 784, 1046, 1318, 1568].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.25, 0.28), i * 90);
    });
  }
  levelUp() {
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => this.playTone(f, 'triangle', 0.15, 0.2), i * 60));
  }
  evoSound() {
    [440, 554, 659, 880, 1108].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.2, 0.25), i * 80));
  }
  achieve() {
    [659, 784, 987, 1318].forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.2, 0.25), i * 70));
  }
  bossAlert() {
    [340, 260, 340, 260, 520].forEach((f, i) => setTimeout(() => this.playTone(f, 'sawtooth', 0.18, 0.3), i * 110));
  }
  gasPistol() {