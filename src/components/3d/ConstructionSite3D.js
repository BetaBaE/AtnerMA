'use client';

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function ConstructionSite3D({
  modelUrl = null,
  title = "Chantier de Construction — Zone Nord",
  subtitle = "34°01′55″N  6°51′12″W · Rabat, Maroc",
  viewportHeight = "100vh",
}) {
  const mountRef = useRef(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const [zoom, setZoom] = useState(90);
  const [loadError, setLoadError] = useState(false);
  const sphericalRef = useRef({ radius: 90, theta: Math.PI / 5, phi: Math.PI / 3.2 });

  useEffect(() => {
    const mount = mountRef.current;
    let width = mount.clientWidth;
    let height = mount.clientHeight;

    // ─── Scene ───────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8FC9E8);
    scene.fog = new THREE.FogExp2(0xb0d4ec, 0.0055);

    // ─── Camera ──────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    const target = new THREE.Vector3(0, 4, 0);

    const updateCamera = () => {
      const s = sphericalRef.current;
      camera.position.set(
        target.x + s.radius * Math.sin(s.phi) * Math.sin(s.theta),
        target.y + s.radius * Math.cos(s.phi),
        target.z + s.radius * Math.sin(s.phi) * Math.cos(s.theta)
      );
      camera.lookAt(target);
    };
    updateCamera();

    // ─── Renderer ─────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);

    // ─── Lighting ────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xfff0d0, 0.7);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffe8c0, 2.2);
    sun.position.set(60, 90, 40);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 4096;
    sun.shadow.mapSize.height = 4096;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 300;
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;
    sun.shadow.bias = -0.001;
    scene.add(sun);

    const fillLight = new THREE.DirectionalLight(0xc0d8ff, 0.5);
    fillLight.position.set(-30, 20, -40);
    scene.add(fillLight);

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const box = (w, h, d, color, x, y, z, opts = {}) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: opts.rough ?? 0.75,
        metalness: opts.metal ?? 0.05,
        ...opts,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y + h / 2, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };

    const cyl = (rt, rb, h, seg, color, x, y, z, opts = {}) => {
      const geo = new THREE.CylinderGeometry(rt, rb, h, seg);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: opts.rough ?? 0.7, ...opts });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y + h / 2, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };

    const line3 = (pts, color) => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts.map(p => new THREE.Vector3(...p)));
      scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color })));
    };

    const animatedObjects = {};

    if (modelUrl) {
      // ─── REAL MODEL MODE — neutral ground, the GLTF carries the rest ───────
      const groundMat = new THREE.MeshStandardMaterial({ color: 0xCFE0D8, roughness: 1 });
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      const loader = new GLTFLoader();
      loader.load(
        modelUrl,
        (gltf) => {
          const root = gltf.scene;
          root.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = true;
              obj.receiveShadow = true;
            }
          });

          // Center the model on the ground and normalize its scale
          const box3 = new THREE.Box3().setFromObject(root);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box3.getSize(size);
          box3.getCenter(center);

          root.position.x -= center.x;
          root.position.z -= center.z;
          root.position.y -= box3.min.y;

          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          const targetSize = 40;
          const scale = targetSize / maxDim;
          root.scale.setScalar(scale);

          scene.add(root);

          // Frame the camera around the loaded model
          target.set(0, (size.y * scale) / 2, 0);
          sphericalRef.current.radius = targetSize * 1.6;
          setZoom(Math.round(sphericalRef.current.radius));
          updateCamera();
          setLoadError(false);
        },
        undefined,
        (err) => {
          console.error('ConstructionSite3D: failed to load model', modelUrl, err);
          setLoadError(true);
        }
      );
    } else {
      // ─── DEMO MODE — fully hardcoded mock construction site ────────────────

      // Ground plane — dirt canvas texture
      const texSize = 512;
      const texCanvas = document.createElement("canvas");
      texCanvas.width = texCanvas.height = texSize;
      const ctx = texCanvas.getContext("2d");
      ctx.fillStyle = "#C9A87C";
      ctx.fillRect(0, 0, texSize, texSize);
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * texSize;
        const y = Math.random() * texSize;
        const r = Math.random() * 3 + 1;
        const v = Math.floor(Math.random() * 30 - 15);
        const base = 180 + v;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${base + 10},${base - 10},${base - 40})`;
        ctx.fill();
      }
      const groundTex = new THREE.CanvasTexture(texCanvas);
      groundTex.wrapS = groundTex.wrapT = THREE.RepeatWrapping;
      groundTex.repeat.set(6, 6);

      const groundGeo = new THREE.PlaneGeometry(160, 160);
      const groundMat = new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.98 });
      const ground = new THREE.Mesh(groundGeo, groundMat);
      ground.rotation.x = -Math.PI / 2;
      ground.receiveShadow = true;
      scene.add(ground);

      // Roads
      const roadMat = new THREE.MeshStandardMaterial({ color: 0x6E6E6E, roughness: 0.95 });
      const road1 = new THREE.Mesh(new THREE.PlaneGeometry(160, 8), roadMat);
      road1.rotation.x = -Math.PI / 2; road1.position.y = 0.02;
      road1.receiveShadow = true; scene.add(road1);
      const road2 = new THREE.Mesh(new THREE.PlaneGeometry(8, 160), roadMat);
      road2.rotation.x = -Math.PI / 2; road2.position.y = 0.02;
      road2.receiveShadow = true; scene.add(road2);

      // Road markings
      for (let i = -70; i < 70; i += 10) {
        const mGeo = new THREE.PlaneGeometry(4, 0.3);
        const mMat = new THREE.MeshStandardMaterial({ color: 0xEEEEAA });
        const mark = new THREE.Mesh(mGeo, mMat);
        mark.rotation.x = -Math.PI / 2;
        mark.position.set(i, 0.03, 0);
        scene.add(mark);
        const mark2 = new THREE.Mesh(mGeo, mMat);
        mark2.rotation.x = -Math.PI / 2;
        mark2.rotation.z = Math.PI / 2;
        mark2.position.set(0, 0.03, i);
        scene.add(mark2);
      }

      // Site boundary fence (orange construction barrier)
      const fenceColor = 0xFF5500;
      for (let x = -55; x < 55; x += 5) {
        box(4.5, 1.8, 0.25, fenceColor, x, 0, -57);
        box(4.5, 1.8, 0.25, fenceColor, x, 0, 57);
      }
      for (let z = -55; z < 55; z += 5) {
        box(0.25, 1.8, 4.5, fenceColor, -57, 0, z);
        box(0.25, 1.8, 4.5, fenceColor, 57, 0, z);
      }
      // Warning stripe
      for (let x = -55; x < 55; x += 5) {
        box(4.5, 0.3, 0.3, 0xFFCC00, x, 1.2, -57);
        box(4.5, 0.3, 0.3, 0xFFCC00, x, 1.2, 57);
      }

      // ─── BUILDING A — Completed concrete skeleton (4 floors) ─────────────────
      const bAx = -28, bAz = -22;
      box(22, 0.6, 16, 0xC0AE98, bAx, 0, bAz);  // foundation slab
      const bACols = [[-9, -6], [-9, 6], [0, -6], [0, 6], [9, -6], [9, 6]];
      bACols.forEach(([cx, cz]) => box(1.2, 24, 1.2, 0xC8C0B4, bAx + cx, 0.6, bAz + cz));
      [6, 12, 18, 23].forEach(fy => box(20, 0.45, 14, 0xBAB0A4, bAx, 0.6 + fy, bAz));
      box(11, 0.45, 14, 0xBAB0A4, bAx - 4, 0.6 + 23, bAz);
      box(4, 25, 4, 0xBBB0A6, bAx + 7, 0.6, bAz);
      box(0.3, 12, 14, 0xD8CCB8, bAx - 10, 0.6, bAz);
      box(20, 12, 0.3, 0xD8CCB8, bAx, 0.6, bAz - 7);

      // ─── BUILDING B — Rising walls, mid-construction ──────────────────────────
      const bBx = 18, bBz = -28;
      box(20, 0.6, 22, 0xC4AF94, bBx, 0, bBz);
      box(20, 14, 0.4, 0xD0B898, bBx, 0.6, bBz - 10.8);
      box(20, 9, 0.4, 0xD0B898, bBx, 0.6, bBz + 10.8);
      box(0.4, 14, 22, 0xCFB796, bBx - 9.8, 0.6, bBz);
      box(0.4, 10, 22, 0xCFB796, bBx + 9.8, 0.6, bBz);
      box(20, 0.45, 22, 0xB8ADA2, bBx, 0.6 + 7, bBz);
      for (let rx = -8; rx <= 8; rx += 4)
        for (let rz = -9; rz <= 9; rz += 4.5)
          box(0.25, 3, 0.25, 0x888888, bBx + rx, 0.6 + 14, bBz + rz);

      // ─── BUILDING C — Just excavated foundation ───────────────────────────────
      const bCx = -22, bCz = 22;
      const pitGeo = new THREE.PlaneGeometry(28, 20);
      const pitMat = new THREE.MeshStandardMaterial({ color: 0x8A6E52, roughness: 1 });
      const pit = new THREE.Mesh(pitGeo, pitMat);
      pit.rotation.x = -Math.PI / 2;
      pit.position.set(bCx, -0.8, bCz);
      pit.receiveShadow = true;
      scene.add(pit);
      box(28, 1.5, 0.4, 0x9A7E62, bCx, -1, bCz - 10);
      box(28, 1.5, 0.4, 0x9A7E62, bCx, -1, bCz + 10);
      box(0.4, 1.5, 20, 0x9A7E62, bCx - 14, -1, bCz);
      box(0.4, 1.5, 20, 0x9A7E62, bCx + 14, -1, bCz);
      for (let px = -10; px <= 10; px += 5)
        for (let pz = -7; pz <= 7; pz += 7)
          box(2.5, 0.9, 2.5, 0xCCC0A8, bCx + px, -0.8, bCz + pz);

      // ─── BUILDING D — Completed multi-story office ────────────────────────────
      const bDx = 22, bDz = 22;
      box(16, 22, 14, 0xE2D5C0, bDx, 0, bDz);
      box(18, 2, 16, 0xD0C4B0, bDx, 21, bDz);
      const winMat = new THREE.MeshStandardMaterial({ color: 0x6AAED6, metalness: 0.7, roughness: 0.15 });
      for (let wx = -2; wx <= 2; wx++) {
        for (let wf = 0; wf < 5; wf++) {
          const w = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 0.15), winMat);
          w.position.set(bDx + wx * 3, 2.5 + wf * 4.2, bDz + 7.1);
          scene.add(w);
          w.castShadow = false;
          const w2 = w.clone();
          w2.position.z = bDz - 7.1;
          scene.add(w2);
        }
      }
      box(8, 0.4, 4, 0xCCC0A8, bDx, 3.5, bDz + 9);
      box(0.5, 3.5, 0.5, 0xAA9988, bDx - 3.5, 0, bDz + 10.5);
      box(0.5, 3.5, 0.5, 0xAA9988, bDx + 3.5, 0, bDz + 10.5);

      // ─── TOWER CRANES ────────────────────────────────────────────────────────
      const makeCrane = (cx, cz, craneHeight, jibLen, counterLen) => {
        box(1.4, craneHeight, 1.4, 0xFFAA00, cx, 0, cz);
        box(jibLen, 0.9, 0.9, 0xFFAA00, cx + jibLen / 2 - 0.7, craneHeight - 0.5, cz);
        box(counterLen, 0.9, 0.9, 0xFF8800, cx - counterLen / 2 + 0.7, craneHeight - 0.5, cz);
        box(2.5, 2.5, 2.5, 0xFFCC44, cx, craneHeight - 1.5, cz);
        box(2, 1.4, 2, 0xFF8800, cx + jibLen * 0.4, craneHeight + 0.2, cz);
        line3([[cx + jibLen * 0.4, craneHeight + 0.2, cz], [cx + jibLen * 0.4, craneHeight - 10, cz]], 0x444444);
        box(1.8, 1.4, 1.8, 0x555555, cx + jibLen * 0.4, craneHeight - 11, cz);
        line3([[cx, craneHeight + 2, cz], [cx + jibLen, craneHeight - 1, cz]], 0x666666);
        line3([[cx, craneHeight + 2, cz], [cx - counterLen, craneHeight - 1, cz]], 0x666666);
      };
      makeCrane(-12, -30, 40, 26, 10);
      makeCrane(35, -5, 32, 22, 9);

      // ─── SCAFFOLDING around Building B ───────────────────────────────────────
      const scafMat = new THREE.MeshStandardMaterial({ color: 0x9A9A9A, roughness: 0.8 });
      for (let sh = 0; sh < 4; sh++) {
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(22, 0.12, 0.12), scafMat);
        hBar.position.set(bBx, 3 + sh * 4, bBz - 12.5);
        scene.add(hBar);
        const hBar2 = hBar.clone();
        hBar2.position.z = bBz + 12.5;
        scene.add(hBar2);
      }
      for (let sp = -10; sp <= 10; sp += 5) {
        const vP = new THREE.Mesh(new THREE.BoxGeometry(0.12, 16, 0.12), scafMat);
        vP.position.set(bBx + sp, 8, bBz - 12.5);
        scene.add(vP);
        const vP2 = vP.clone();
        vP2.position.z = bBz + 12.5;
        scene.add(vP2);
        line3([[bBx + sp, 0, bBz - 12.5], [bBx + sp + 5, 4, bBz - 12.5]], 0x888888);
      }
      for (let ph = 0; ph < 4; ph++) {
        const planks = new THREE.Mesh(new THREE.BoxGeometry(22, 0.08, 0.6), new THREE.MeshStandardMaterial({ color: 0x8B6914 }));
        planks.position.set(bBx, 3 + ph * 4, bBz - 12.5);
        scene.add(planks);
      }

      // ─── CONCRETE MIXER TRUCK ─────────────────────────────────────────────────
      box(7, 2.8, 3.2, 0xCC3322, 10, 0, 12);
      box(3, 2.2, 3, 0xBB2211, 13, 2.4, 12);
      box(1.5, 1.5, 3, 0x555555, 9.5, 0.5, 12);
      const drumMesh = cyl(1.6, 1.6, 4, 16, 0xDDDDDD, 9, 3.8, 12, { rough: 0.4 });
      drumMesh.rotation.z = 0.35;
      box(3, 0.3, 0.5, 0x888888, 7, 2.5, 12);
      animatedObjects.drum = drumMesh;

      // ─── EXCAVATOR ───────────────────────────────────────────────────────────
      box(5.5, 2, 4, 0xFFCC00, -8, 0, 16);
      box(4.5, 2, 3.5, 0xFFAA00, -8, 1.5, 14);
      box(3.5, 2.2, 3.2, 0xFFDD00, -7, 2.5, 15.5);
      box(0.9, 3.5, 0.9, 0xFF9900, -6.5, 4.5, 13.5);
      box(0.9, 3, 0.9, 0xFF9900, -6.5, 7, 11.5);
      box(2, 0.8, 1.8, 0x888888, -6.5, 9, 10);

      // ─── DUMP TRUCK ──────────────────────────────────────────────────────────
      box(8, 2.5, 4, 0x445566, -5, 0, -5);
      box(2.5, 2.5, 3.8, 0x334455, -8.5, 2.2, -5);
      box(6.5, 3, 3.8, 0x556677, -4.5, 2.2, -5);

      // ─── MATERIAL STOCKPILES ──────────────────────────────────────────────────
      const sandGeo = new THREE.ConeGeometry(5, 3.2, 16);
      const sandMesh = new THREE.Mesh(sandGeo, new THREE.MeshStandardMaterial({ color: 0xE8CC70, roughness: 1 }));
      sandMesh.position.set(-42, 1.6, 8);
      sandMesh.castShadow = true;
      scene.add(sandMesh);

      const gravGeo = new THREE.ConeGeometry(3.5, 2.2, 12);
      const gravMesh = new THREE.Mesh(gravGeo, new THREE.MeshStandardMaterial({ color: 0x9A8E80, roughness: 1 }));
      gravMesh.position.set(-36, 1.1, 14);
      gravMesh.castShadow = true;
      scene.add(gravMesh);

      for (let rb = 0; rb < 6; rb++) {
        const rbMesh = cyl(0.18, 0.18, 7, 8, 0x888888, -42 + rb * 0.4, 0.3 + rb * 0.32, -8);
        rbMesh.rotation.z = Math.PI / 2;
      }

      for (let cb = 0; cb < 4; cb++) {
        box(2.5, 1.2, 1.2, 0xCCCCCC, -44 + cb * 2.8, 0, -15);
        box(2.5, 1.2, 1.2, 0xCCCCCC, -44 + cb * 2.8, 1.2, -15);
      }

      for (let tp = 0; tp < 6; tp++) {
        box(6, 0.2, 0.9, 0x9B6A1A, -40, 0 + tp * 0.22, 20);
      }

      // ─── SITE OFFICE (Portakabin) ─────────────────────────────────────────────
      box(10, 3.2, 5, 0x4488BB, -44, 0, 28);
      box(10, 3.2, 5, 0x4477AA, -44, 0, 38);
      box(10, 3.2, 5, 0x55AACC, -44, 0, 34);
      box(1.5, 2.4, 0.2, 0x336688, -40, 0, 30.5);
      cyl(0, 0.8, 0.1, 12, 0xDDDDDD, -47, 3.2 + 0.5, 28);

      // ─── PARKING AREA ─────────────────────────────────────────────────────────
      const parkMat = new THREE.MeshStandardMaterial({ color: 0x6A6A6A, roughness: 0.9 });
      const park = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), parkMat);
      park.rotation.x = -Math.PI / 2;
      park.position.set(38, 0.03, 35);
      park.receiveShadow = true;
      scene.add(park);
      const carColors = [0xCC2222, 0x2255CC, 0x228822, 0xCCCC22, 0xAAAAAA];
      carColors.forEach((c, i) => {
        box(4, 1.4, 2, c, 30 + (i % 3) * 5.5, 0.05, 30 + Math.floor(i / 3) * 5);
        box(3, 0.9, 1.8, c, 30 + (i % 3) * 5.5, 0.05 + 1.4, 30 + Math.floor(i / 3) * 5);
      });

      // ─── POWER POLE & WIRES ───────────────────────────────────────────────────
      box(0.4, 14, 0.4, 0x664422, -48, 0, -40);
      box(4, 0.3, 0.3, 0x774433, -48, 14, -40);
      box(0.4, 14, 0.4, 0x664422, 48, 0, -40);
      box(4, 0.3, 0.3, 0x774433, 48, 14, -40);
      line3([[-46, 14, -40], [46, 14, -40]], 0x333333);
      line3([[-46, 13.5, -40], [46, 13.5, -40]], 0x333333);

      // ─── TREES (outside the fence) ────────────────────────────────────────────
      const treePositions = [
        [-65, -50], [-65, -30], [-65, 30], [-65, 50],
        [65, -50], [65, -30], [65, 30], [65, 50],
        [-30, 65], [30, 65], [-30, -65], [30, -65],
      ];
      treePositions.forEach(([tx, tz]) => {
        box(0.7, 5, 0.7, 0x6B4226, tx, 0, tz);
        const leafGeo = new THREE.SphereGeometry(3.5, 8, 6);
        const leafMesh = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x2D7A32, roughness: 1 }));
        leafMesh.position.set(tx, 7.5, tz);
        leafMesh.castShadow = true;
        scene.add(leafMesh);
      });

      // ─── WATER TANK ──────────────────────────────────────────────────────────
      cyl(3, 3, 4, 16, 0xCCCCCC, 42, 0, -40, { rough: 0.3 });
      cyl(3.2, 3.2, 0.4, 16, 0xBBBBBB, 42, 3.8, -40);
      box(0.4, 6, 0.4, 0x888888, 40, 0, -40);
      box(0.4, 6, 0.4, 0x888888, 44, 0, -40);

      // ─── SIGN BOARD ──────────────────────────────────────────────────────────
      box(0.3, 5, 0.3, 0x555555, -52, 0, -55);
      box(0.3, 5, 0.3, 0x555555, -48, 0, -55);
      box(5, 3.5, 0.3, 0x0055AA, -50, 4.5, -55);
      // ─── PORTA-POTTIES ───────────────────────────────────────────────────────
      for (let pp = 0; pp < 3; pp++) {
        box(1.5, 2.5, 1.5, 0x2299AA, -50 + pp * 2.5, 0, 52);
      }

      // ─── MINI-CRANES (on building) ────────────────────────────────────────────
      box(0.8, 1.2, 0.8, 0xFF8800, bAx + 7, 24 + 0.6, bAz - 2);
    }

    // ─── CONTROLS (manual orbit) ──────────────────────────────────────────────
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };

    const onDown = (e) => {
      isDragging = true;
      lastMouse = { x: e.clientX ?? e.touches?.[0].clientX, y: e.clientY ?? e.touches?.[0].clientY };
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const cx = e.clientX ?? e.touches?.[0].clientX;
      const cy = e.clientY ?? e.touches?.[0].clientY;
      const dx = cx - lastMouse.x;
      const dy = cy - lastMouse.y;
      sphericalRef.current.theta -= dx * 0.004;
      sphericalRef.current.phi = Math.max(0.18, Math.min(Math.PI / 2.05, sphericalRef.current.phi + dy * 0.004));
      lastMouse = { x: cx, y: cy };
      updateCamera();
    };
    const onUp = () => { isDragging = false; };
    const onWheel = (e) => {
      e.preventDefault();
      sphericalRef.current.radius = Math.max(20, Math.min(200, sphericalRef.current.radius + e.deltaY * 0.08));
      setZoom(Math.round(sphericalRef.current.radius));
      updateCamera();
    };

    renderer.domElement.addEventListener("mousedown", onDown);
    renderer.domElement.addEventListener("mousemove", onMove);
    renderer.domElement.addEventListener("mouseup", onUp);
    renderer.domElement.addEventListener("mouseleave", onUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("touchstart", e => onDown(e), { passive: true });
    renderer.domElement.addEventListener("touchmove", e => onMove(e), { passive: true });
    renderer.domElement.addEventListener("touchend", onUp);

    // ─── Animate ──────────────────────────────────────────────────────────────
    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      if (animatedObjects.drum) animatedObjects.drum.rotation.y = t * 0.6;
      renderer.render(scene, camera);
    };
    animate();

    // ─── Resize ──────────────────────────────────────────────────────────────
    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("mousedown", onDown);
      renderer.domElement.removeEventListener("mousemove", onMove);
      renderer.domElement.removeEventListener("mouseup", onUp);
      renderer.domElement.removeEventListener("mouseleave", onUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [modelUrl]);

  const zoomLevel = Math.round(100 - ((zoom - 20) / 180) * 100);

  return (
    <div style={{
      width: "100%", height: viewportHeight, position: "relative",
      fontFamily: "'Roboto', 'Arial', sans-serif",
      overflow: "hidden", background: "#202124"
    }}>
      {/* Three.js viewport */}
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

      {/* ── Google Maps-style top bar ── */}
      <div style={{
        position: "absolute", top: 12, left: 12, right: 12,
        display: "flex", alignItems: "center", gap: 10,
        pointerEvents: "none",
      }}>
        <div style={{
          background: "white",
          borderRadius: 8,
          padding: "8px 14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
          display: "flex", alignItems: "center", gap: 10,
          minWidth: 0, flex: 1, maxWidth: 420,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z" stroke="#EA4335" strokeWidth="2" fill="#EA4335" fillOpacity="0.2"/>
            <circle cx="12" cy="10" r="3" stroke="#EA4335" strokeWidth="2" fill="#EA4335"/>
          </svg>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#202124", lineHeight: 1.2 }}>
              {title}
            </div>
            <div style={{ fontSize: 11, color: "#5f6368", lineHeight: 1.3 }}>
              {subtitle}
            </div>
          </div>
        </div>

        {/* <div style={{
          background: "white", borderRadius: 8,
          padding: "8px 12px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          fontSize: 11, color: "#5f6368",
          whiteSpace: "nowrap",
        }}>
          🏗️ <span style={{ fontWeight: 700, color: "#1a73e8" }}>3D Construction View</span>
        </div> */}
      </div>

      {/* ── Compass ── */}
      {/*<div style={{
        position: "absolute", top: 70, right: 14,
        background: "white", 
        borderRadius: "50%",
        width: 48, height: 48,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontSize: 10, lineHeight: 1,
      }}>
        <span style={{ color: "#EA4335", fontWeight: 900, fontSize: 18, lineHeight: 1 }}>▲</span>
        <span style={{ color: "#333", fontWeight: 700, fontSize: 11 }}>N</span>
      </div> */}

      {/* ── Zoom controls ── */}
      <div style={{
        position: "absolute", top: 130, right: 14,
        background: "white",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {["+", "−"].map((sym, i) => (
          <button key={sym} onClick={() => {
            sphericalRef.current.radius = Math.max(20, Math.min(200, sphericalRef.current.radius + (i === 0 ? -15 : 15)));
            setZoom(Math.round(sphericalRef.current.radius));
          }} style={{
            width: 40, height: 40,
            background: "white",
            border: "none",
            borderBottom: i === 0 ? "1px solid #e0e0e0" : "none",
            fontSize: 22, cursor: "pointer", color: "#444",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 0, lineHeight: 1,
          }}>{sym}</button>
        ))}
      </div>

      {/* ── Layer toggle buttons ── */}


      {/* ── Legend (demo mock-site mode only) ── */}
      {!modelUrl && (
        <div style={{
          position: "absolute", bottom: 14, left: 14,
          background: "rgba(255,255,255,0.95)",
          borderRadius: 10,
          padding: "10px 14px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
          fontSize: 11.5,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#202124", fontSize: 12 }}>SITE LEGEND</div>
          {[
            ["#C8A87C", "Foundation / Earthwork"],
            ["#CCCCCC", "Concrete Skeleton"],
            ["#FFAA00", "Tower Cranes (×2)"],
            ["#FFCC00", "Heavy Equipment"],
            ["#4488BB", "Site Offices"],
            ["#E8CC70", "Material Stockpiles"],
            ["#FF5500", "Site Perimeter Fence"],
          ].map(([color, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
              <div style={{ width: 13, height: 13, borderRadius: 3, background: color, flexShrink: 0 }} />
              <span style={{ color: "#5f6368" }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Model load error ── */}
      {loadError && (
        <div style={{
          position: "absolute", bottom: 14, left: 14,
          background: "rgba(220,40,40,0.92)",
          borderRadius: 10,
          padding: "10px 14px",
          color: "#fff",
          fontSize: 12,
          maxWidth: 280,
        }}>
          Impossible de charger le modèle 3D.
        </div>
      )}

      {/* ── Controls hint ── */}
      <div style={{
        position: "absolute", top: "50%", right: 14,
        transform: "translateY(-50%)",
        background: "rgba(32,33,36,0.8)",
        borderRadius: 8, padding: "8px 10px",
        fontSize: 10, color: "rgba(255,255,255,0.85)",
        lineHeight: 1.8,
        backdropFilter: "blur(4px)",
      }}>
        🖱️ Drag to rotate<br />
        ⚙️ Scroll to zoom
      </div>

      {/* ── Scale bar ── */}
      <div style={{
        position: "absolute", bottom: 14, right: 14,
        background: "rgba(255,255,255,0.92)",
        borderRadius: 6,
        padding: "6px 12px",
        boxShadow: "0 1px 6px rgba(0,0,0,0.2)",
        fontSize: 11, color: "#444",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      }}>
        <div style={{
          width: 90, height: 5,
          background: "linear-gradient(to right, #333 0%, #333 50%, white 50%, white 100%)",
          border: "1px solid #888",
        }} />
        <div style={{ display: "flex", justifyContent: "space-between", width: 90, fontSize: 10, color: "#555" }}>
          <span>0</span><span>25m</span><span>50m</span>
        </div>
      </div>

      {/* ── Google Maps bottom street-view bar ── */}
      <div style={{
        position: "absolute", bottom: 14, left: "50%",
        transform: "translateX(-50%)",
        background: "white", borderRadius: 24,
        padding: "6px 18px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
        display: "flex", gap: 16, alignItems: "center",
        fontSize: 12, color: "#5f6368",
      }}>
        <span style={{ cursor: "pointer", color: "#1a73e8", fontWeight: 600 }}>◉ Street View</span>
        <span style={{ color: "#ccc" }}>|</span>
        <span>© 2026 Google</span>
        <span style={{ color: "#ccc" }}>|</span>
        <span style={{ cursor: "pointer", color: "#1a73e8" }}>Report</span>
      </div>
    </div>
  );
}
