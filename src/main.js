import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaec6cf);
// const axes = new THREE.AxesHelper(10);
// scene.add(axes);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera 
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 25, 25);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 9.1);
controls.update();

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(10, 20, 10);
scene.add(dir);

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({ color: 0x4caf50 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Pond
const pond = new THREE.Mesh(
  new THREE.CircleGeometry(4, 32),
  new THREE.MeshStandardMaterial({ color: 0x2196f3 })
);
pond.rotation.x = -Math.PI / 2;
pond.position.set(8, 0.01, 19);
scene.add(pond);

function createTree(x, z, trunkHeight = 2, trunkRadius = 0.3, leavesRadius = 1) {
  const group = new THREE.Group();

  // Trunk
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(trunkRadius, trunkRadius, trunkHeight, 16),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );
  trunk.position.y = trunkHeight / 2; 
  group.add(trunk);

  // Leaves
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(leavesRadius, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x228B22 }) 
  );
  leaves.position.y = trunkHeight + leavesRadius; 
  group.add(leaves);

  // Position the tree
  group.position.set(x, 0, z);
  scene.add(group);

  return group;
}

// Left-side trees
createTree(-5, 5);
createTree(-10, -5);
createTree(-15, 0);
createTree(-15, -12);
createTree(-24, -11);
createTree(-40, -12);
createTree(-24, 0);
createTree(-24, 10);
createTree(-18, 17);
createTree(-17, 12);

// Right-side trees
createTree(12, -5);
createTree(15, -12);
createTree(20, -10);
createTree(25, -15);
createTree(30, -12);
createTree(25, -5);
createTree(20, 0);
createTree(25, 5);
createTree(20, 10);
createTree(25, 12);
createTree(22, 17);
createTree(17, 15);
createTree(16, 20);

// Bottom-right trees

const bushOBJLoader = new OBJLoader();
const bushMTLLoader = new MTLLoader();

// Create Bush Function using Blender Model
function createBush(x, z) {
  bushMTLLoader.load("/models/bush.mtl", (materials) => {
    materials.preload();
    bushOBJLoader.setMaterials(materials);
  });
  // The shading was wrong because of the material,
  // so I had to manually change the blender Object's
  // material to match the lighting and color
  bushOBJLoader.load("/models/bush.obj", (object) => {
    object.traverse(child => {
      if (child.isMesh && child.name === "Sphere") {
        child.material = new THREE.MeshStandardMaterial({
          color: 0x228B22   // same green as your tree
        });
      }
    });
      const bush = object;
      bush.scale.set(0.7, 0.7, 0.7);
      bush.position.set(x, 0, z); 

      scene.add(bush);
    });
}

// Bushes 
createBush(-10, -14);
createBush(8, -10);
createBush(-16, 5);
createBush(-34, -2);
createBush(-20, 21);
createBush(34, -5);

// Path 1-7
const path1 = new THREE.Mesh(new THREE.PlaneGeometry(4, 20), new THREE.MeshStandardMaterial({ color: 0xc2b280 }));
path1.rotation.x = -Math.PI / 2; path1.position.set(0, 0.01, -10); scene.add(path1);

const path2 = new THREE.Mesh(new THREE.PlaneGeometry(16, 4), new THREE.MeshStandardMaterial({ color: 0xc2b280 }));
path2.rotation.x = -Math.PI / 2; path2.position.set(6, 0.01, 2); scene.add(path2);

const path3 = new THREE.Mesh(new THREE.PlaneGeometry(4, 10), new THREE.MeshStandardMaterial({ color: 0xc2b280 }));
path3.rotation.x = -Math.PI / 2; path3.position.set(12, 0.01, 8); scene.add(path3);

const path4 = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), new THREE.MeshStandardMaterial({ color: 0xc2b280 }));
path4.rotation.x = -Math.PI / 2; path4.position.set(0, 0.01, 11); scene.add(path4);

const path5 = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), new THREE.MeshStandardMaterial({ color: 0xc2b280 }));
path5.rotation.x = -Math.PI / 2; path5.position.set(-8, 0.01, 16); scene.add(path5);

const path6 = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshStandardMaterial({ color: 0xc2b280 }));
path6.rotation.x = -Math.PI / 2; path6.position.set(-6, 0.01, 21); scene.add(path6);

const path7 = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), new THREE.MeshStandardMaterial({ color: 0xc2b280 }));
path7.rotation.x = -Math.PI / 2; path7.position.set(0, 0.01, 22); scene.add(path7);

// Zombie Movement Path Vectors 
const pathCenters = [
  new THREE.Vector3(0, 0, 24),    // Path7
  new THREE.Vector3(0, 0, 21),   // Path6
  new THREE.Vector3(-8, 0, 21),   // Path5
  new THREE.Vector3(-8, 0, 11),    // Path4
  new THREE.Vector3(12, 0, 11),    // Path3
  new THREE.Vector3(12, 0, 2),     // Path2
  new THREE.Vector3(0, 0, 2),   // Path1
  new THREE.Vector3(0, 0, -20)   // Fence (goal)
];

// Fence or Goal
const fence = new THREE.Mesh(
  new THREE.BoxGeometry(6, 1, 0.5),
  new THREE.MeshStandardMaterial({ color: 0x8d6e63 })
);
fence.position.set(0, 0.5, -20);
scene.add(fence);
const fenceBoundingBox = new THREE.Box3().setFromObject(fence);

const towers = [];
const projectiles = [];

// Crystal Tower 
function createTower(x, z) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 1, 1.2, 16),
    new THREE.MeshStandardMaterial({ color: 0x555555 })
  );
  const bigCrystal = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.6, 0.8),
    new THREE.MeshStandardMaterial({ color: 0x2196f3 })
  );

  bigCrystal.position.y = 1.1;
  bigCrystal.rotation.x = Math.PI / 4; 
  bigCrystal.rotation.y = Math.PI / 4; 

  group.add(base); 
  group.add(bigCrystal);
  

  group.position.set(x, 0.6, z);
  scene.add(group);

  towers.push(group);
  return group;
}

// Tower Preview before Placing
function createTowerPreview() {

  const geo = new THREE.PlaneGeometry(2, 2); 
  const mat = new THREE.MeshBasicMaterial({
    color: 0x00FFFF,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide
  });

  const square = new THREE.Mesh(geo, mat);
  square.rotation.x = -Math.PI / 2; 
  square.position.y = 0.02;   

  return square;
}

function spawnProjectile(fromPos, targetZombie) {
  const geom = new THREE.SphereGeometry(0.18, 12, 12);
  const mat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
  const mesh = new THREE.Mesh(geom, mat);

  mesh.position.copy(fromPos);
  scene.add(mesh);

  projectiles.push({
    mesh,
    target: targetZombie,
    speed: 18,
    life: 2.0,
  });
}


// Zombie Object and Material Creation 
const zombieOBJLoader = new OBJLoader();
const zombieMTLLoader = new MTLLoader();
const zombies = []; 

function createZombie(position) {
  // Store zombie data before zombie mesh is fully loaded,
  // so you have the object reference before the mesh is
  // loaded
  const zombieData = {
    mesh: null,
    leftArm: null,
    rightArm: null,
    leftPivot: null,
    rightPivot: null,
    pathSegment: 0,
    t: 0,
    health: 100,
    boundingBox: null
  };

  zombieMTLLoader.load("/models/zombie.mtl", (materials) => {
    materials.preload();
    zombieOBJLoader.setMaterials(materials);

    zombieOBJLoader.load("/models/zombie.obj", (object) => {
      const zombie = object;
      zombie.scale.set(0.2, 0.2, 0.2);
      zombie.position.copy(position);

      // Creating left and right arm pivots for animation later
      const leftArm = zombie.getObjectByName("leftArm");
      const rightArm = zombie.getObjectByName("rightArm");

      const leftPivot = new THREE.Object3D();
      const rightPivot = new THREE.Object3D();

      leftPivot.position.set(-4, 12, 0);
      rightPivot.position.set(4, 12, 0);

      leftArm.position.set(4, -12, 0);
      rightArm.position.set(-4, -12, 0);

      leftPivot.add(leftArm);
      rightPivot.add(rightArm);

      zombie.add(leftPivot);
      zombie.add(rightPivot);

      scene.add(zombie);

      zombieData.mesh = zombie;
      zombieData.leftArm = leftArm;
      zombieData.rightArm = rightArm;
      zombieData.leftPivot = leftPivot;
      zombieData.rightPivot = rightPivot;

      // Bounding box for collision detection with fence or projectiles
      const zombie_bounding_box = new THREE.Box3().setFromObject(zombie);
      zombieData.boundingBox = zombie_bounding_box;

      zombies.push(zombieData);
  
    });
  });

  return zombieData;
}

// Game Phase Managment
let gamePhase = "building";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let placingTower = false;
let towerPreview = null;

let stop = false;
let fast = false;

// Handle Placement Mode for Towers after Pressing "b"
// and showing Tower Preview
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case 'b':
      if (gamePhase === "building") {
      placingTower = !placingTower;

        if (placingTower) {
          towerPreview = createTowerPreview();
          scene.add(towerPreview);
        } 
        else {
          if (towerPreview) {
            scene.remove(towerPreview);
            towerPreview = null;
          }
        }
      }
      break;
    case 's' :
      stop = !stop;
      if (stop) {
        clock.stop();
      }
      else {
        clock.start();
      }
      break;
    case 'f' :
      fast = !fast;
      if (fast === true) {
        speed = 15;
      }
      else {
        speed = 5;
      }
      break;
    case 'p' :
      if (towers.length === 0) break;
      const target = zombies.find(z => z.mesh);
      if (!target || !target.mesh) break;
      const tower = towers[towers.length - 1];
      const from = new THREE.Vector3().copy(tower.position);
      from.y = 1.2;
      spawnProjectile(from, target);
      break;
  }
});

// Handling Tracking Coordinates of Mouse Position
// on the Actual Screen, not World Plane
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Handling Tower Placement After Pressing "b"
window.addEventListener("mousedown", () => {

  if (!placingTower) return;
  if (gamePhase !== "building") return;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(ground);

  if (hits.length > 0) {
    const p = hits[0].point;
    if (currentMoney >= 100) {
      currentMoney -= 100;
      updateMoneyBar(currentMoney);
      createTower(p.x, p.z);
    }
  }
});

// Handles the Tower Preview's Position
// based on Mouse Position and Raycaster Intersection
// with the Ground Plane
function updateTowerPreview() {

  if (!placingTower) return;
  if (!towerPreview) return;
  if (gamePhase !== "building") return;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObject(ground);

  if (hits.length > 0) {
    const p = hits[0].point;
    towerPreview.position.set(p.x, 0.02, p.z);
  }

}

// Wave Variables
let currentWave = 0;
const waves = [
  { count: 4, spawnInterval: 2000 },
  { count: 6, spawnInterval: 1500 },
  { count: 9, spawnInterval: 1000 }
];

// HUD Update Function
const hud = document.getElementById("hud");

function updateWaveHUD(currentWave, totalWaves) {
  hud.textContent = `Wave ${currentWave}/${totalWaves}`;
}

let speed = 5;
// Wave Spawning Function 
function spawnWave(wave) {
  gamePhase = "zombie"; 
  placingTower = false;
  if (towerPreview) {
    scene.remove(towerPreview);
    towerPreview = null;
  }
  speed += 5;

  let spawned = 0;
  for (let i = 0; i < wave.count; i++) {
    setTimeout(() => {
      const zombieData = createZombie(pathCenters[0]);
      spawned++;

      // Only after the first zombie mesh exists, start moving it
      const checkReady = setInterval(() => {
        if (zombieData.mesh) {
          clearInterval(checkReady);
        }
      }, 10);

    }, 
    i * wave.spawnInterval); 
  }
  updateWaveHUD(currentWave + 1, waves.length);

  currentMoney += 200;
  updateMoneyBar(currentMoney);
}

// Healthbar
const totalHealth = 100;
let currentHealth = totalHealth;
const healthBar = document.getElementById("health");

function updateHealthBar(currentHealth, totalHealth) {
  health.textContent = `Health: ${currentHealth} / ${totalHealth}`;
}

let currentMoney = 500;
const moneyBar = document.getElementById("money");

function updateMoneyBar(currentMoney) {
  moneyBar.textContent = `Money: ${currentMoney}`;
}

// Handler for Pressing "Enter" to Start Next Wave
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (gamePhase === "building" && currentWave < waves.length) {
      spawnWave(waves[currentWave]);
      currentWave++; 
    }
  }
});

// Check handler to see if Wave is Complete
function checkWaveComplete() {
  let activeZombies = false;

  for (let i = 0; i < zombies.length; i++) {
    if (zombies[i].pathSegment < pathCenters.length - 1) {
      activeZombies = true;
      break; 
    }
    
    }
    if (!activeZombies) { 
      gamePhase = "building";  
    }
}

// Main Animation Loop for Zombies
const clock = new THREE.Clock();

function animateZombies(dt) {
  zombies.forEach(z => {
    if (!z.mesh) return; 

    const start = pathCenters[z.pathSegment];
    const end = pathCenters[z.pathSegment + 1];
    if (!end) return;

    z.mesh.lookAt(end.x, z.mesh.position.y, end.z);

    const segmentLength = start.distanceTo(end);
    z.t += (speed * dt) / segmentLength;
    z.mesh.position.lerpVectors(start, end, z.t);
    z.mesh.position.y = 0;

    const armSpeed = 4;
    const angle = Math.sin(clock.getElapsedTime() * armSpeed) * Math.PI / 6;
    z.leftPivot.rotation.x = angle;
    z.rightPivot.rotation.x = -angle;

    if (z.t >= 1) {
      z.t = 0;
      z.pathSegment++;
      if (z.pathSegment >= pathCenters.length - 1) {
        z.pathSegment = pathCenters.length - 1;
      }
    }
  });
}

// Update loop for projectiles
function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    p.life -= dt;
    if (p.life <= 0 || !p.target || !p.target.mesh) {
      scene.remove(p.mesh);
      projectiles.splice(i, 1);
      continue;
    }

    const targetPos = new THREE.Vector3().copy(p.target.mesh.position);
    targetPos.y = 0.8;

    const dir = targetPos.clone().sub(p.mesh.position);
    const dist = dir.length();

    if (dist < 0.35) {
      // "hit": just despawn for v1
      scene.remove(p.mesh);
      projectiles.splice(i, 1);
      continue;
    }

    dir.normalize();
    p.mesh.position.addScaledVector(dir, p.speed * dt);
  }
}


// Outer Animation Control Loop
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  animateZombies(dt);
  updateProjectiles(dt);

  const HEALTH_DECREMENT = 5;
  for (let i = zombies.length - 1; i >= 0; i--) {
    const zombie = zombies[i];

    zombie.boundingBox.setFromObject(zombie.mesh);

    if (zombie.boundingBox.intersectsBox(fenceBoundingBox)) {
      scene.remove(zombie.mesh);
      zombies.splice(i, 1);


      currentHealth -= HEALTH_DECREMENT;
      updateHealthBar(currentHealth, totalHealth);
    }
  }

  checkWaveComplete();
    
  updateTowerPreview();

  controls.update();
  renderer.render(scene, camera);
}

animate();
controls.update();

// Handler for Resizing Window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

