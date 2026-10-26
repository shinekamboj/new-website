import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WIDTH = 720;
const HEIGHT = 430;
const LANE_X = [-2.25, 0, 2.25];

function makeMaterial(color, options = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.62, metalness: 0.04, ...options });
}

export default function GemRunner3D() {
  const mountRef = useRef(null);
  const runtimeRef = useRef(null);
  const statusRef = useRef('ready');
  const [status, setStatus] = useState('ready');
  const [hud, setHud] = useState({ gems: 0, distance: 0, lane: 1 });
  const [gameReady, setGameReady] = useState(false);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    let renderer;
    let animationFrame;
    let resizeObserver;
    let runtime;
    let scene;
    const mount = mountRef.current;

    try {
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#8ad7ff');
      scene.fog = new THREE.Fog('#8ad7ff', 34, 100);
      const camera = new THREE.PerspectiveCamera(58, WIDTH / HEIGHT, 0.1, 140);
      camera.position.set(0, 5.2, 9.2);
      camera.lookAt(0, 0.8, -13);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.setSize(WIDTH, HEIGHT, false);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      renderer.domElement.setAttribute('aria-label', 'Three-dimensional Gem Runner game scene');
      mount.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0xdaf6ff, 0x508454, 2.2));
      const sun = new THREE.DirectionalLight(0xfff2cf, 3.1);
      sun.position.set(-5, 12, 7);
      scene.add(sun);

      const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 150), makeMaterial('#68bd6a'));
      ground.rotation.x = -Math.PI / 2;
      ground.position.set(0, -0.15, -36);
      scene.add(ground);

      const road = new THREE.Mesh(new THREE.PlaneGeometry(8.2, 112), makeMaterial('#46566c', { roughness: 0.9 }));
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, -0.03, -36);
      scene.add(road);
      const addBox = (x, y, z, sx, sy, sz, color, parent = scene) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), makeMaterial(color));
        mesh.position.set(x, y, z);
        parent.add(mesh);
        return mesh;
      };

      // Colorful side rails and dashed lane dividers.
      [-4.18, 4.18].forEach((x) => {
        addBox(x, 0.18, -36, 0.22, 0.36, 112, '#f5cc55');
        addBox(x, 0.4, -36, 0.1, 0.1, 112, '#fff0a3');
      });
      [-1.12, 1.12].forEach((x) => {
        for (let z = 12; z > -90; z -= 7) addBox(x, 0.015, z, 0.045, 0.025, 3.2, '#d6e6eb');
      });

      // Bright low-poly trees and clouds add depth without external art files.
      const treeTrunk = new THREE.CylinderGeometry(0.12, 0.2, 1.2, 6);
      const treeTop = new THREE.ConeGeometry(0.8, 1.8, 6);
      for (let z = 10; z > -88; z -= 9) {
        [-1, 1].forEach((side, index) => {
          const x = side * (6.2 + ((Math.floor(Math.abs(z) / 9) + index) % 3) * 1.3);
          const trunk = new THREE.Mesh(treeTrunk, makeMaterial('#8b5739'));
          trunk.position.set(x, 0.6, z - index * 3);
          scene.add(trunk);
          const leaves = new THREE.Mesh(treeTop, makeMaterial(index ? '#28a878' : '#37b86e'));
          leaves.position.set(x, 1.9, z - index * 3);
          scene.add(leaves);
        });
        if (z % 18 === 10) {
          const cloud = new THREE.Mesh(new THREE.SphereGeometry(1.1, 9, 7), makeMaterial('#ffffff', { roughness: 1 }));
          cloud.position.set((z % 2 ? -1 : 1) * 13, 8 + (z % 2), z - 8);
          cloud.scale.set(1.8, 0.55, 0.8);
          scene.add(cloud);
        }
      }

      // A bright little runner assembled from simple 3D shapes.
      const player = new THREE.Group();
      const suit = makeMaterial('#ff765d');
      const trim = makeMaterial('#ffe18c');
      const skin = makeMaterial('#ffd2aa');
      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.15, 0.58), suit);
      torso.position.y = 0.92;
      player.add(torso);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.37, 16, 12), skin);
      head.position.y = 1.76;
      player.add(head);
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.39, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), makeMaterial('#593c6b'));
      hair.position.y = 1.91;
      player.add(hair);
      const visor = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.08), makeMaterial('#75e5f2', { metalness: 0.25, roughness: 0.25 }));
      visor.position.set(0, 1.78, 0.33);
      player.add(visor);
      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.2, 0.61), trim);
      belt.position.y = 0.58;
      player.add(belt);
      const legGeometry = new THREE.BoxGeometry(0.31, 0.63, 0.34);
      [-0.23, 0.23].forEach((x) => {
        const leg = new THREE.Mesh(legGeometry, makeMaterial('#425bc4'));
        leg.position.set(x, 0.42, 0);
        player.add(leg);
        const boot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.48), makeMaterial('#273c62'));
        boot.position.set(x, 0.12, 0.08);
        player.add(boot);
      });
      player.position.set(LANE_X[1], 0, 1.7);
      scene.add(player);

      const items = [];
      const gemGeometry = new THREE.OctahedronGeometry(0.52, 0);
      const gemMaterial = makeMaterial('#38e7f3', { metalness: 0.48, roughness: 0.19, emissive: '#087b97', emissiveIntensity: 0.45 });
      const obstacleGeometry = new THREE.BoxGeometry(1.25, 1.35, 0.9);
      const obstacleMaterial = makeMaterial('#f15e69', { roughness: 0.4, emissive: '#581824', emissiveIntensity: 0.15 });
      const obstacleTopMaterial = makeMaterial('#ffca68');

      function addItem(kind, lane, z) {
        let mesh;
        if (kind === 'gem') {
          mesh = new THREE.Mesh(gemGeometry, gemMaterial);
          mesh.position.y = 1.05;
        } else {
          mesh = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
          mesh.position.y = 0.68;
          const cap = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.18, 0.98), obstacleTopMaterial);
          cap.position.y = 0.63;
          mesh.add(cap);
        }
        mesh.position.x = LANE_X[lane];
        mesh.position.z = z;
        scene.add(mesh);
        items.push({ mesh, kind, lane, collected: false });
      }

      function addWave(z) {
        const gemLane = Math.floor(Math.random() * 3);
        for (let lane = 0; lane < 3; lane += 1) addItem(lane === gemLane ? 'gem' : 'obstacle', lane, z);
      }

      runtime = {
        scene, camera, renderer, player, items, lane: 1, targetLane: 1,
        gems: 0, distance: 0, speed: 11, jumpVelocity: 0, spawnTimer: 0,
        hudTimer: 0, status: 'ready',
        setLane(direction) {
          if (this.status !== 'playing') return;
          this.targetLane = THREE.MathUtils.clamp(this.targetLane + direction, 0, 2);
          this.lane = this.targetLane;
          setHud((value) => ({ ...value, lane: this.lane }));
        },
        jump() {
          if (this.status === 'playing' && this.player.position.y <= 0.02) this.jumpVelocity = 8.3;
        },
        start() {
          this.status = 'playing';
          statusRef.current = 'playing';
          this.lane = 1;
          this.targetLane = 1;
          this.gems = 0;
          this.distance = 0;
          this.speed = 11;
          this.jumpVelocity = 0;
          this.spawnTimer = 2.5;
          this.hudTimer = 0;
          this.player.position.set(LANE_X[1], 0, 1.7);
          this.items.forEach(({ mesh }) => this.scene.remove(mesh));
          this.items.length = 0;
          [-13, -29, -45, -61].forEach((z) => addWave(z));
          setHud({ gems: 0, distance: 0, lane: 1 });
          setStatus('playing');
        },
        end() {
          if (this.status !== 'playing') return;
          this.status = 'over';
          statusRef.current = 'over';
          setStatus('over');
        },
      };
      runtimeRef.current = runtime;
      setGameReady(true);

      const clock = new THREE.Clock();
      const animate = () => {
        animationFrame = window.requestAnimationFrame(animate);
        const delta = Math.min(clock.getDelta(), 0.045);
        if (runtime.status === 'playing') {
          runtime.distance += runtime.speed * delta;
          runtime.speed = Math.min(18, 11 + runtime.distance * 0.012);
          runtime.player.position.x = THREE.MathUtils.damp(runtime.player.position.x, LANE_X[runtime.targetLane], 12, delta);
          if (runtime.jumpVelocity > 0 || runtime.player.position.y > 0) {
            runtime.player.position.y += runtime.jumpVelocity * delta;
            runtime.jumpVelocity -= 22 * delta;
            if (runtime.player.position.y <= 0) {
              runtime.player.position.y = 0;
              runtime.jumpVelocity = 0;
            }
          }
          runtime.player.rotation.z = THREE.MathUtils.damp(runtime.player.rotation.z, (runtime.targetLane - runtime.lane) * -0.12, 8, delta);
          runtime.items.forEach((item) => {
            item.mesh.position.z += runtime.speed * delta;
            if (item.kind === 'gem') {
              item.mesh.rotation.y += 2.5 * delta;
              item.mesh.position.y = 1.05 + Math.sin(performance.now() / 240 + item.lane) * 0.11;
            }
            const nearRunner = Math.abs(item.mesh.position.z - runtime.player.position.z) < 0.9;
            const sameLane = Math.abs(item.mesh.position.x - runtime.player.position.x) < 0.76;
            if (nearRunner && sameLane && !item.collected) {
              item.collected = true;
              if (item.kind === 'gem') runtime.gems += 1;
              else if (runtime.player.position.y < 0.56) runtime.end();
              item.mesh.visible = false;
            }
          });
          for (let index = runtime.items.length - 1; index >= 0; index -= 1) {
            const item = runtime.items[index];
            if (item.collected || item.mesh.position.z > 11) {
              runtime.scene.remove(item.mesh);
              runtime.items.splice(index, 1);
            }
          }
          runtime.spawnTimer -= delta;
          if (runtime.spawnTimer <= 0) {
            addWave(-68);
            runtime.spawnTimer = 3.15;
          }
          runtime.hudTimer += delta;
          if (runtime.hudTimer >= 0.12) {
            runtime.hudTimer = 0;
            setHud({ gems: runtime.gems, distance: Math.floor(runtime.distance), lane: runtime.lane });
          }
        }
        renderer.render(scene, camera);
      };
      animate();

      resizeObserver = new ResizeObserver(() => {
        const width = mount.clientWidth || WIDTH;
        const height = mount.clientHeight || HEIGHT;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      });
      resizeObserver.observe(mount);

      function onKeyDown(event) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'Spacebar'].includes(event.key)) event.preventDefault();
        if (event.repeat || statusRef.current !== 'playing') return;
        const key = event.key.toLowerCase();
        if (key === 'arrowleft' || key === 'a') runtime.setLane(-1);
        if (key === 'arrowright' || key === 'd') runtime.setLane(1);
        if (key === 'arrowup' || key === 'w' || key === ' ' || key === 'spacebar') runtime.jump();
      }
      window.addEventListener('keydown', onKeyDown, { passive: false });
      runtime.cleanupKeys = () => window.removeEventListener('keydown', onKeyDown);
    } catch (error) {
      console.error('Gem Runner 3D could not start:', error);
      setWebglError(true);
      setStatus('unsupported');
    }

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      runtime?.cleanupKeys?.();
      runtimeRef.current = null;
      if (renderer) {
        const geometries = new Set();
        const materials = new Set();
        scene?.traverse((object) => {
          if (!object.isMesh) return;
          if (object.geometry) geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => {
            if (material) materials.add(material);
          });
        });
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  function startGame() {
    runtimeRef.current?.start();
  }

  const overlayMessage = webglError
    ? 'This browser could not start the 3D view.'
    : status === 'ready'
      ? 'Ready to run?'
      : `Run over! You collected ${hud.gems} gems.`;

  return (
    <div className="challenge-panel gem-runner-panel">
      <div className="gem-runner-hud" aria-live="polite">
        <span>💎 {hud.gems} gems</span>
        <span>🏃 {hud.distance} m</span>
        <span>LANE {hud.lane + 1} / 3</span>
      </div>
      <div className="gem-runner-stage" ref={mountRef} aria-label="Gem Runner 3D game scene" />
      {status !== 'playing' && (
        <div className="gem-runner-overlay" role="status">
          <strong>{overlayMessage}</strong>
          {!webglError && <button className="confirm-button" type="button" onClick={startGame} disabled={!gameReady}>Start running 🏃</button>}
        </div>
      )}
      <div className="gem-runner-controls" aria-label="Gem Runner movement controls">
        <button type="button" aria-label="Move left" onClick={() => runtimeRef.current?.setLane(-1)}>←</button>
        <button type="button" aria-label="Move right" onClick={() => runtimeRef.current?.setLane(1)}>→</button>
        <button type="button" aria-label="Jump" onClick={() => runtimeRef.current?.jump()}>↑ Jump</button>
      </div>
      <p className="arcade-help">← → change lanes · ↑ / Space jump · Collect 💎 and dodge blocks</p>
    </div>
  );
}
