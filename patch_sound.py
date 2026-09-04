with open('app/src/main/assets/game.html', 'r') as f:
    text = f.read()

update_motor_old = """  updateMotor(speedRatio) {
    if (!this.motorOsc || !this.motorGain || !this.ctx) return;
    const t = this.ctx.currentTime;
    this.motorOsc.frequency.setTargetAtTime(45 + speedRatio * 80, t, 0.08);
    this.motorGain.gain.setTargetAtTime(0.01 + speedRatio * 0.025, t, 0.08);
  }"""
update_motor_new = """  updateMotor(speedRatio, isForklift = false) {
    if (!this.motorOsc || !this.motorGain || !this.ctx) return;
    const t = this.ctx.currentTime;
    if (!isForklift) {
       this.motorGain.gain.setTargetAtTime(0.001, t, 0.2);
    } else {
       this.motorOsc.frequency.setTargetAtTime(45 + speedRatio * 80, t, 0.08);
       this.motorGain.gain.setTargetAtTime(0.01 + speedRatio * 0.025, t, 0.08);
    }
  }"""

text = text.replace(update_motor_old, update_motor_new)

# Update the caller in update(dt)
text = text.replace("sounds.updateMotor(spdRatio);", "sounds.updateMotor(spdRatio, player.isForklift);")

with open('app/src/main/assets/game.html', 'w') as f:
    f.write(text)
