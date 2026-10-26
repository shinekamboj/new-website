import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

const GAME_WIDTH = 640;
const GAME_HEIGHT = 400;

class TurboTrackScene extends Phaser.Scene {
  constructor() {
    super('TurboTrackScene');
    this.controls = { left: false, right: false, gas: false, brake: false };
    this.raceState = 'ready';
    this.lap = 0;
    this.seconds = 60;
    this.speed = 0;
    this.previousProgress = 0;
    this.hudElapsed = 0;
    this.clockElapsed = 0;
  }

  create() {
    this.drawTrack();
    this.drawFinishLine();
    this.createDecorations();
    this.createCar();
    this.keys = this.input.keyboard.addKeys({
      up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
      w: 'W', a: 'A', s: 'S', d: 'D',
    });
    this.game.events.emit('turbo-ready');
    this.emitHud();
  }

  drawTrack() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x76c76c, 0x76c76c, 0x4d9e5c, 0x4d9e5c, 1);
    graphics.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Little grass flecks give the infield and park some texture.
    for (let i = 0; i < 120; i += 1) {
      const x = (i * 83 + 19) % GAME_WIDTH;
      const y = (i * 47 + 13) % GAME_HEIGHT;
      graphics.fillStyle(i % 2 ? 0x8bd47a : 0x5eae62, 0.7);
      graphics.fillCircle(x, y, i % 5 === 0 ? 2 : 1);
    }

    graphics.lineStyle(104, 0x27394a, 1);
    graphics.strokeEllipse(320, 200, 450, 260);
    graphics.lineStyle(94, 0x596272, 1);
    graphics.strokeEllipse(320, 200, 450, 260);
    graphics.lineStyle(4, 0xf4f0d6, 0.88);
    graphics.strokeEllipse(320, 200, 500, 310);
    graphics.strokeEllipse(320, 200, 400, 210);

    // Dashed center line follows the oval circuit.
    graphics.lineStyle(2, 0xf2eab4, 0.62);
    for (let angle = 0; angle < Math.PI * 2; angle += 0.22) {
      const start = angle;
      const end = angle + 0.1;
      graphics.beginPath();
      graphics.moveTo(320 + Math.cos(start) * 225, 200 + Math.sin(start) * 130);
      graphics.lineTo(320 + Math.cos(end) * 225, 200 + Math.sin(end) * 130);
      graphics.strokePath();
    }
  }

  drawFinishLine() {
    const graphics = this.add.graphics();
    const left = 300;
    const top = 24;
    const cell = 10;
    for (let row = 0; row < 10; row += 1) {
      for (let column = 0; column < 4; column += 1) {
        graphics.fillStyle((row + column) % 2 ? 0xffffff : 0x253044, 1);
        graphics.fillRect(left + column * cell, top + row * cell, cell, cell);
      }
    }
    this.add.text(320, 14, 'START / FINISH', {
      fontFamily: 'Arial, sans-serif', fontSize: '10px', fontStyle: 'bold', color: '#fff4c4',
      stroke: '#253044', strokeThickness: 3,
    }).setOrigin(0.5);
  }

  createDecorations() {
    const trees = [
      [42, 55], [105, 45], [190, 42], [430, 40], [530, 51], [595, 85],
      [55, 335], [150, 358], [490, 355], [585, 325], [250, 345], [390, 350],
    ];
    trees.forEach(([x, y], index) => {
      this.add.circle(x, y + 7, 11, 0x396c43, 0.45);
      this.add.circle(x, y, 10 + (index % 3), index % 2 ? 0x2d874c : 0x348f54);
      this.add.circle(x - 3, y - 4, 3, 0x8ad77b, 0.9);
    });
    this.add.text(320, 200, 'TURBO PARK', {
      fontFamily: 'Arial, sans-serif', fontSize: '20px', fontStyle: 'bold', color: '#b4e99c',
    }).setOrigin(0.5).setAlpha(0.58);
  }

  createCar() {
    this.car = this.add.container(320, 75);
    const body = this.add.graphics();
    body.fillStyle(0x202b3c, 1);
    body.fillRoundedRect(-18, -15, 9, 12, 3);
    body.fillRoundedRect(9, -15, 9, 12, 3);
    body.fillRoundedRect(-18, 3, 9, 12, 3);
    body.fillRoundedRect(9, 3, 9, 12, 3);
    body.fillStyle(0xff714f, 1);
    body.fillRoundedRect(-21, -11, 42, 22, 8);
    body.fillStyle(0xffb36b, 1);
    body.fillRoundedRect(3, -8, 12, 16, 4);
    body.fillStyle(0xa9e7f3, 1);
    body.fillRoundedRect(-9, -7, 13, 14, 4);
    body.fillStyle(0xfff4c0, 1);
    body.fillCircle(18, -6, 2);
    body.fillCircle(18, 6, 2);
    body.fillStyle(0x793849, 1);
    body.fillCircle(-18, -6, 2);
    body.fillCircle(-18, 6, 2);
    this.car.add(body);
    this.car.setDepth(5);
    this.add.text(320, 104, 'YOU', {
      fontFamily: 'Arial, sans-serif', fontSize: '9px', fontStyle: 'bold', color: '#fff',
      stroke: '#27394a', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(6);
  }

  setControl(name, isPressed) {
    if (name in this.controls) this.controls[name] = isPressed;
  }

  emitHud() {
    this.game.events.emit('turbo-hud', {
      lap: this.lap,
      seconds: this.seconds,
      speed: Math.round(this.speed / 2.6),
      heading: Math.round((Phaser.Math.RadToDeg(this.car?.rotation ?? 0) + 360) % 360),
    });
  }

  tapSteer(direction) {
    if (this.raceState !== 'racing' || !this.car) return;
    this.car.rotation = Phaser.Math.Angle.Wrap(this.car.rotation + (direction === 'left' ? -0.42 : 0.42));
    this.emitHud();
  }

  tapAccelerate() {
    if (this.raceState !== 'racing') return;
    this.speed = Math.min(260, this.speed + 55);
    this.emitHud();
  }

  tapBrake() {
    if (this.raceState !== 'racing') return;
    this.speed = Math.max(0, this.speed - 75);
    this.emitHud();
  }

  startRace() {
    this.raceState = 'racing';
    this.lap = 0;
    this.seconds = 60;
    this.speed = 0;
    this.previousProgress = 0;
    this.clockElapsed = 0;
    this.hudElapsed = 0;
    this.car.setPosition(320, 75).setRotation(0);
    this.game.events.emit('turbo-status', 'racing');
    this.emitHud();
  }

  finishRace(state) {
    if (this.raceState !== 'racing') return;
    this.raceState = state;
    this.controls = { left: false, right: false, gas: false, brake: false };
    this.game.events.emit('turbo-status', state);
  }

  update(_time, deltaMs) {
    if (this.raceState !== 'racing') return;
    const delta = Math.min(deltaMs / 1000, 0.04);
    const key = this.keys;
    const gas = this.controls.gas || key.up.isDown || key.w.isDown;
    const brake = this.controls.brake || key.down.isDown || key.s.isDown;
    const left = this.controls.left || key.left.isDown || key.a.isDown;
    const right = this.controls.right || key.right.isDown || key.d.isDown;

    if (gas) this.speed = Math.min(260, this.speed + 200 * delta);
    else this.speed = Math.max(0, this.speed - 48 * delta);
    if (brake) this.speed = Math.max(0, this.speed - 300 * delta);

    const steering = Number(right) - Number(left);
    if (steering && this.speed > 8) {
      this.car.rotation += steering * 2.55 * delta * Math.min(this.speed / 95, 1.15);
    }
    this.car.x += Math.cos(this.car.rotation) * this.speed * delta;
    this.car.y += Math.sin(this.car.rotation) * this.speed * delta;

    const dx = (this.car.x - 320) / 225;
    const dy = (this.car.y - 200) / 130;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const onTrack = Math.abs(radius - 1) < 0.42;
    if (!onTrack) this.speed = Math.min(this.speed, 95);

    if (this.car.x < 20 || this.car.x > GAME_WIDTH - 20 || this.car.y < 20 || this.car.y > GAME_HEIGHT - 20) {
      this.car.x = Phaser.Math.Clamp(this.car.x, 20, GAME_WIDTH - 20);
      this.car.y = Phaser.Math.Clamp(this.car.y, 20, GAME_HEIGHT - 20);
      this.speed *= 0.45;
    }

    const angle = Math.atan2(dy, dx);
    const progress = (angle + Math.PI / 2 + Math.PI * 2) % (Math.PI * 2);
    if (onTrack && this.speed > 70 && this.previousProgress > 5.7 && progress < 0.55) {
      this.lap += 1;
      if (this.lap >= 3) this.finishRace('won');
    }
    this.previousProgress = progress;

    this.clockElapsed += deltaMs;
    if (this.clockElapsed >= 1000) {
      const elapsedSeconds = Math.floor(this.clockElapsed / 1000);
      this.clockElapsed -= elapsedSeconds * 1000;
      this.seconds = Math.max(0, this.seconds - elapsedSeconds);
      if (this.seconds === 0) this.finishRace('timeout');
    }

    this.hudElapsed += deltaMs;
    if (this.hudElapsed >= 180) {
      this.hudElapsed = 0;
      this.emitHud();
    }
  }
}

export default function TurboTrack() {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const [status, setStatus] = useState('ready');
  const [hud, setHud] = useState({ lap: 0, seconds: 60, speed: 0, heading: 0 });
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      parent: mountRef.current,
      backgroundColor: '#4d9e5c',
      antialias: true,
      scene: [TurboTrackScene],
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      render: { pixelArt: false, roundPixels: true },
    });
    const handleReady = () => setGameReady(true);
    gameRef.current = game;
    game.events.on('turbo-ready', handleReady);
    game.events.on('turbo-hud', setHud);
    game.events.on('turbo-status', setStatus);
    return () => {
      game.events.off('turbo-ready', handleReady);
      game.events.off('turbo-hud', setHud);
      game.events.off('turbo-status', setStatus);
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  function setControl(name, isPressed) {
    gameRef.current?.scene.getScene('TurboTrackScene')?.setControl(name, isPressed);
  }

  function start() {
    gameRef.current?.scene.getScene('TurboTrackScene')?.startRace();
  }

  function tapControl(control) {
    const scene = gameRef.current?.scene.getScene('TurboTrackScene');
    if (control === 'left' || control === 'right') scene?.tapSteer(control);
    if (control === 'gas') scene?.tapAccelerate();
    if (control === 'brake') scene?.tapBrake();
  }

  function controlButton(label, control, glyph) {
    return (
      <button
        key={control}
        type="button"
        aria-label={label}
        onPointerDown={(event) => { event.preventDefault(); setControl(control, true); }}
        onPointerUp={() => setControl(control, false)}
        onPointerLeave={() => setControl(control, false)}
        onPointerCancel={() => setControl(control, false)}
        onClick={() => tapControl(control)}
      >{glyph}</button>
    );
  }

  const message = status === 'ready' ? 'Ready, racer?' : status === 'won' ? '🏆 You won the race!' : '🏁 Time’s up! Try again.';

  return (
    <div className="challenge-panel turbo-panel">
      <div className="turbo-hud" aria-live="polite">
        <span>🏁 LAP {hud.lap} / 3</span>
        <span>⏱ {hud.seconds}s</span>
        <span>⚡ {hud.speed} km/h</span>
        <span>🧭 {hud.heading}°</span>
      </div>
      <div className="turbo-stage" ref={mountRef} aria-label="Turbo Track 2D racing game" />
      {status !== 'racing' && (
        <div className="turbo-overlay" role="status">
          <strong>{message}</strong>
          <button className="confirm-button" type="button" onClick={start} disabled={!gameReady}>{status === 'ready' ? 'Start race 🏎️' : 'Race again ↻'}</button>
        </div>
      )}
      <div className="turbo-controls" aria-label="Racing controls">
        <div className="turbo-steering">
          {controlButton('Steer left', 'left', '←')}
          {controlButton('Steer right', 'right', '→')}
        </div>
        <div className="turbo-pedals">
          {controlButton('Accelerate', 'gas', '▲')}
          {controlButton('Brake', 'brake', '▼')}
        </div>
      </div>
      <p className="arcade-help">Keyboard: ↑ accelerate · ← → steer · ↓ brake · Touch controls work too</p>
    </div>
  );
}
