import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js"

// Scene and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaec6cf);
// const axes = new THREE.AxesHelper(10);
// scene.add(axes);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

// Camera 
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
camera.position.set(0, 25, 25);

// Fixed Orbital Controls
const orbitalControls = new OrbitControls(camera, renderer.domElement);
orbitalControls.target.set(0, 0, 9.1);
orbitalControls.update();

// Movement Controls
const pointerLockControls = new PointerLockControls(camera, renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(10, 20, 10);

dir.castShadow = true;

dir.shadow.mapSize.width = 2048;
dir.shadow.mapSize.height = 2048;

dir.shadow.camera.near = 1;
dir.shadow.camera.far = 100;
dir.shadow.camera.left = -50;
dir.shadow.camera.right = 50;
dir.shadow.camera.top = 50;
dir.shadow.camera.bottom = -50;

scene.add(dir);

// Loading all Textures
const textureLoader = new THREE.TextureLoader();

const grassColor = textureLoader.load("/textures/grass_diffuse.jpg")
const grassNormal = textureLoader.load("/textures/grass_normal.jpg")
const grassRough = textureLoader.load("/textures/grass_rough.jpg")
const pathColor = textureLoader.load("/textures/path_diffuse.jpg")
const pathNormal = textureLoader.load("/textures/path_normal.jpg")
const pathRough = textureLoader.load("/textures/path_rough.jpg")
const water = textureLoader.load("/textures/water.png")

grassColor.wrapS = THREE.RepeatWrapping;
grassColor.wrapT = THREE.RepeatWrapping;
pathColor.wrapS = THREE.RepeatWrapping;
pathColor.wrapT = THREE.RepeatWrapping;

grassNormal.wrapS = THREE.RepeatWrapping;
grassNormal.wrapT = THREE.RepeatWrapping;
pathNormal.wrapS = THREE.RepeatWrapping;
pathNormal.wrapT = THREE.RepeatWrapping;

grassRough.wrapS = THREE.RepeatWrapping;
grassRough.wrapT = THREE.RepeatWrapping;
pathRough.wrapS = THREE.RepeatWrapping;
pathRough.wrapT = THREE.RepeatWrapping;

water.wrapS = THREE.RepeatWrapping;
water.wrapT = THREE.RepeatWrapping;

grassColor.repeat.set(50, 50);
grassNormal.repeat.set(50, 50);
grassRough.repeat.set(50, 50);
water.repeat.set(5, 5);

// Create Path Function for Varaible Texture Mapping based of Path Dimensions
function createPath(width, height, x, y, z, repeatFactor = 1) {
    const mat = new THREE.MeshStandardMaterial({
        map: pathColor.clone(),
        normalMap: pathNormal.clone(),
        roughnessMap: pathRough.clone()
    });

    mat.map.repeat.set(width * repeatFactor, height * repeatFactor);
    mat.normalMap.repeat.set(width * repeatFactor, height * repeatFactor);
    mat.roughnessMap.repeat.set(width * repeatFactor, height * repeatFactor);

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    scene.add(mesh);

    return mesh;
}

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({
  map: grassColor,
  normalMap: grassNormal,
  roughnessMap: grassRough
  })
);
ground.receiveShadow = true;
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Pond
const pond = new THREE.Mesh(
  new THREE.CircleGeometry(4, 32),
  new THREE.MeshStandardMaterial({ map: water })
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
  group.traverse(child => {
  if (child.isMesh) {
    child.castShadow = true;
    child.receiveShadow = true;
  }
  });
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
    object.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
    });

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
const pathMaterial = new THREE.MeshStandardMaterial({
  map: pathColor,
  normalMap: pathNormal,
  roughnessMap: pathRough
});

const path1 = createPath(4, 20, 0, 0.01, -10, 0.5);
const path2 = createPath(16, 4, 6, 0.01, 2, 0.5);
const path3 = createPath(4, 10, 12, 0.01, 8, 0.5);
const path4 = createPath(20, 4, 0, 0.01, 11, 0.5);
const path5 = createPath(4, 6, -8, 0.01, 16, 0.5);
const path6 = createPath(8, 4, -6, 0.01, 21, 0.5);
const path7 = createPath(4, 6, 0, 0.01, 22, 0.5);

const pathMeshes = [path1, path2, path3, path4, path5, path6, path7];

path1.receiveShadow = true;
path2.receiveShadow = true;
path3.receiveShadow = true;
path4.receiveShadow = true;
path5.receiveShadow = true;
path6.receiveShadow = true;
path7.receiveShadow = true;

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
function createTower(x, z, range = 15) {
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

  group.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  

  group.position.set(x, 0.6, z);
  scene.add(group);

  towers.push({
    mesh: group,
    cooldown: 0,
    range: range,
    radius: TOWER_RADIUS
  });
  return group;
}

// Tower Preview before Placing
function createTowerPreview(range = TOWER_RANGE) {
  const previewTower = new THREE.Group();

  // Tower Placement Square
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
  previewTower.add(square);

  // Range Indicator Circle
  const rangeGeo = new THREE.RingGeometry(range - 0.1, range, 64);
  const rangeMat = new THREE.MeshBasicMaterial({
    color: 0x00FFFF,
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide
  });
  const rangeCircle = new THREE.Mesh(rangeGeo, rangeMat);
  rangeCircle.rotation.x = -Math.PI / 2;
  rangeCircle.position.y = 0.01;
  previewTower.add(rangeCircle);

  previewTower.range = range;
  previewTower.rangeCircle = rangeCircle;

  return previewTower;
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
    speed: BASE_PROJECTILE_SPEED * timeScale,
    life: BASE_PROJECTILE_LIFE / timeScale,
  });
}


// Zombie Object and Material Creation 
const zombieOBJLoader = new OBJLoader();
const zombieMTLLoader = new MTLLoader();
const zombies = []; 

function createZombie(position, health = 100) {
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
    boundingBox: null,
    healthbar: null
  };

  zombies.push(zombieData);

  zombieMTLLoader.load("/models/zombie.mtl", (materials) => {
    materials.preload();
    zombieOBJLoader.setMaterials(materials);

    zombieOBJLoader.load("/models/zombie.obj", (object) => {
      const zombie = object;
      zombie.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
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


      zombieData.health = health;

      // Create health bar
      const bbox = new THREE.Box3().setFromObject(zombie);
      const topWorldY = bbox.max.y;

      // Convert top height to zombie-local Y (zombie is in world space)
      const localTopY = (topWorldY - zombie.position.y) + 15; // small offset above head

      const healthBarGeo = new THREE.PlaneGeometry(3.2, 0.4);
      const healthBarMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.DoubleSide
      });
      const healthBar = new THREE.Mesh(healthBarGeo, healthBarMat);

      healthBar.position.set(0, localTopY, 0);
      zombie.add(healthBar);

      zombieData.healthBar = healthBar;
      zombie.add(healthBar);

      zombieData.healthBar = healthBar;

      zombieData.mesh = zombie;
      zombieData.leftArm = leftArm;
      zombieData.rightArm = rightArm;
      zombieData.leftPivot = leftPivot;
      zombieData.rightPivot = rightPivot;

      // Bounding box for collision detection with fence or projectiles
      const zombie_bounding_box = new THREE.Box3().setFromObject(zombie);
      zombieData.boundingBox = zombie_bounding_box;

      //zombies.push(zombieData);
  
    });
  });

  return zombieData;
}

// Game Phase Managment
let gamePhase = "building";
let gameOver = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let placingTower = false;
let towerPreview = null;

let stop = false;
let fast = false;
let timeScale = 1;
let freeCamera = false;

// Handle Placement Mode for Towers after Pressing "b"
// and showing Tower Preview
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case 'b':
      if (gamePhase === "building") {
        placingTower = !placingTower;

        if (placingTower) {
          towerPreview = createTowerPreview(TOWER_RANGE);
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
      timeScale = fast ? 3 : 1;
      break;
    case 'p' :
      if (towers.length === 0) break;
      const target = zombies.find(z => z.mesh);
      if (!target || !target.mesh) break;
      const tower = towers[towers.length - 1];
      const from = new THREE.Vector3().copy(tower.mesh.position);
      from.y = 1.2;
      spawnProjectile(from, target);
      break;
    case 'c' :
      freeCamera = !freeCamera;
      if (freeCamera) {
        pointerLockControls.unlock();
        orbitalControls.enabled = false;
        pointerLockControls.lock();
      }
      else {
        pointerLockControls.unlock();
        orbitalControls.enabled = true;
        camera.position.set(0, 25, 25);
        orbitalControls.target.set(0, 0, 9.1);
      }
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

  // 1) Where on the ground did we click?
  const groundHits = raycaster.intersectObject(ground);
  if (groundHits.length === 0) return;
  const p = groundHits[0].point;

  // 2) Did the ray hit a path mesh at (almost) the same spot?
  const pathHits = raycaster.intersectObjects(pathMeshes);

  // If we hit a path, and that hit is very close in distance to the ground hit,
  // then the click is on the path area -> block tower placement.
  if (pathHits.length > 0) {
    const d = Math.abs(pathHits[0].distance - groundHits[0].distance);
    if (d < 0.2) return;  // blocks placing on path
  }

  // block pond
  const pondHits = raycaster.intersectObject(pond);
  if (pondHits.length > 0) {
    const d = Math.abs(pondHits[0].distance - groundHits[0].distance);
    if (d < 0.2) return;
  }

  // place tower
  if (currentMoney < TOWER_COST) {
    flashHudMessage("Not enough money!");
    return;
  }

  currentMoney -= TOWER_COST;
  updateMoneyBar(currentMoney);
  createTower(p.x, p.z);
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
  { count: 4, spawnInterval: 2000, money: 100, speed: 7, health: 100 },
  { count: 6, spawnInterval: 1700, money: 200, speed: 10, health: 125 },
  { count: 9, spawnInterval: 1500, money: 200, speed: 12, health: 150 },
  { count: 11, spawnInterval: 1200, money: 300, speed: 13, health: 175 },
  { count: 14, spawnInterval: 1000, money: 400, speed: 14, health: 200 }
];

// HUD Update Function
const hud = document.getElementById("hud");

function updateWaveHUD(currentWave, totalWaves) {
  hud.textContent = `Wave ${currentWave}/${totalWaves}`;
}

function flashHudMessage(msg) {
  if (!hud) return;

  const old = hud.textContent;
  hud.textContent = msg;

  setTimeout(() => {
    hud.textContent = old;
  }, 800);
}

// Game Over Screen Function
const gameOverScreen = document.getElementById("game-over-screen");

// Styling Game Over Message (wouldn't work when I put it in style.css)
gameOverScreen.style.color = "#ff4444"; 
gameOverScreen.style.fontSize = "3rem";
gameOverScreen.style.fontWeight = "bold";
gameOverScreen.style.textAlign = "center";
gameOverScreen.style.position = "fixed";
gameOverScreen.style.top = "50%";
gameOverScreen.style.left = "50%";
gameOverScreen.style.transform = "translate(-50%, -50%)";
gameOverScreen.style.zIndex = "9999";
gameOverScreen.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
gameOverScreen.style.border = "3px solid #ff4444";
gameOverScreen.style.padding = "20px";
gameOverScreen.style.display = "none";

function showGameOver() {
  gameOverScreen.style.display = "block";
}

function hideGameOver() {
  gameOverScreen.style.display = "none";
}

function triggerGameOver() {
  gameOver = true;
  clock.stop();
  showGameOver();
}

let speed = 0;
let waveSpawning = false;
let zombiesToSpawn = 0;
let spawnTimer = 0;
let spawnInterval = 0;
let zombieHealth = 100;

// Wave Spawning Function 
function spawnWave(wave) {
  gamePhase = "zombie"; 
  placingTower = false;
  if (towerPreview) {
    scene.remove(towerPreview);
    towerPreview = null;
  }
  speed = wave.speed;

  // Set values to be used in updateWaveSpawner
  zombiesToSpawn = wave.count;
  spawnInterval = wave.spawnInterval / 1000;
  spawnTimer = 0;
  waveSpawning = true;
  zombieHealth = wave.health;

  updateWaveHUD(currentWave + 1, waves.length);

  currentMoney += wave.money;
  updateMoneyBar(currentMoney);
}

// Zombie creation
function updateWaveSpawner(dt) {
  if (!waveSpawning) {
    return;
  }
  if (zombiesToSpawn <= 0) {
    waveSpawning = false;
    return;
  }

  spawnTimer -= dt;

  if (spawnTimer <= 0) {
    createZombie(pathCenters[0], zombieHealth);
    zombiesToSpawn--;

    spawnTimer = spawnInterval;
  }
}

// Healthbar
const totalHealth = 100;
let currentHealth = totalHealth;
const healthBar = document.getElementById("health");

function updateHealthBar(currentHealth, totalHealth) {
  health.textContent = `Health: ${currentHealth} / ${totalHealth}`;
}

let currentMoney = 100;
const moneyBar = document.getElementById("money");

function updateMoneyBar(currentMoney) {
  moneyBar.textContent = `Money: ${currentMoney}`;
}

// Handler for Pressing "Enter" to Start Next Wave
window.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    if (gamePhase === "building" && currentWave < waves.length) {
      placingTower = false;
      spawnWave(waves[currentWave]);
      currentWave++; 
    }
  }
});

function setNightMode() {
  scene.background = new THREE.Color(0x0b132b);

  ambientLight.intensity = 0.2;

  dir.color.set(0x9bbcff);
  dir.intensity = 0.5;
  ground.material.color.set(0x728f6e);
}

function setDayMode() {
  scene.background = new THREE.Color(0xaec6cf);

  ambientLight.intensity = 1;

  dir.color.set(0xffffff);
  dir.intensity = 1;

  ground.material.color.set(0x97e08d);
}

// Check handler to see if Wave is Complete
function checkWaveComplete() {
  if (zombies.length > 0) return;

  if (waveSpawning) return;

  gamePhase = "building";
  
  // let activeZombies = false;

  // for (let i = 0; i < zombies.length; i++) {
  //   if (zombies[i].pathSegment < pathCenters.length - 1) {
  //     activeZombies = true;
  //     break; 
  //   }
    
  //   }
  //   if (!activeZombies) { 
  //     gamePhase = "building";  
  //   }
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

const TOWER_FIRE_COOLDOWN = 0.75; // seconds between shots
const TOWER_RANGE = 10;          // how far towers can shoot
const TOWER_RADIUS = 1.5;
const TOWER_COST = 100;
const BASE_PROJECTILE_SPEED = 18;
const BASE_PROJECTILE_LIFE = 2.0;

function updateTowers(dt) {
  // Don't rely on gamePhase while debugging:
  // if (gamePhase !== "zombie") return;

  if (zombies.length === 0) return;
  if (towers.length === 0) return;

  for (const t of towers) {
    // Support BOTH formats:
    // 1) old: t is a THREE.Group
    // 2) new: t is { mesh, cooldown }
    const mesh = t.mesh ?? t;

    // Cooldown handling for both formats
    if (t.cooldown === undefined) t.cooldown = 0;
    t.cooldown -= dt;
    if (t.cooldown > 0) continue;

    // Find nearest zombie with a loaded mesh
    let bestZombie = null;
    let bestDist = Infinity;

    for (const z of zombies) {
      if (!z.mesh) continue;

      const d = mesh.position.distanceTo(z.mesh.position);
      if (d < bestDist && d <= (t.range ?? TOWER_RANGE)) {
        bestDist = d;
        bestZombie = z;
      }
    }

    if (!bestZombie) continue;

    while (t.cooldown <= 0) {
      const from = new THREE.Vector3().copy(mesh.position);
      from.y = 1.2;
      spawnProjectile(from, bestZombie);

      t.cooldown += TOWER_FIRE_COOLDOWN;
    }
  }
}

// Update loop for projectiles
function updateProjectiles(dt) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    if (!p.target || !p.target.mesh) {
      scene.remove(p.mesh);
      projectiles.splice(i, 1);
      continue;
    }

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

    // Use raycasting for continuous collision detection when moving fast
    let hit = false;
    if (dist > 0) {
      const moveDistance = p.speed * dt;
      
      // Check if projectile would pass through target
      if (moveDistance >= dist || dist < 0.35) {
        hit = true;
      }
    }

    if (hit) {
      p.target.health -= 25;

      // Update health bar scale
      if (p.target.healthBar) {
        const ratio = Math.max(p.target.health / 100, 0);
        p.target.healthBar.scale.x = ratio;
      }

      if (p.target.health <= 0) {
        // remove mesh
        scene.remove(p.target.mesh);

        // remove data safely
        const idx = zombies.indexOf(p.target);
        if (idx !== -1) zombies.splice(idx, 1);

        // prevent double-kill weirdness
        p.target.mesh = null;
      }
      // "hit": just despawn for v1
      scene.remove(p.mesh);
      projectiles.splice(i, 1);
      continue;
    }

    dir.normalize();
    p.mesh.position.addScaledVector(dir, p.speed * dt);
  }
}

// Game Reset Logic
window.addEventListener("keydown", (event) => {
  if (event.key === "r" || event.key === "R") {
    if (gameOver) {
      resetGame();
    }
  }
});

function resetGame() {
  currentHealth = totalHealth;
  updateHealthBar(currentHealth, totalHealth);

  zombies.forEach(z => {
    if (z.mesh) scene.remove(z.mesh);
  });
  zombies.length = 0; 

  towers.forEach(t => {
    if (t.mesh) scene.remove(t.mesh);
  });
  towers.length = 0;

  projectiles.forEach(p => scene.remove(p.mesh));
  projectiles.length = 0;

  currentWave = 0;
  updateWaveHUD(0, waves.length);
  gamePhase = "building";
  gameOver = false;

  waveSpawning = false;
  zombiesToSpawn = 0;
  spawnTimer = 0;

  hud.textContent = "Press Enter to Start Game";

  hideGameOver();

  clock.start();

  currentMoney = 100;
  updateMoneyBar(currentMoney);
}

const moveBy = {
  forward: false,
  backward: false,
  left: false,
  right: false
};

// Key handling for arrow key controls
window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case "ArrowUp": 
      moveBy.forward = true; 
      break;
    case "ArrowDown": 
      moveBy.backward = true; 
      break;
    case "ArrowLeft": 
      moveBy.left = true; 
      break;
    case "ArrowRight": 
      moveBy.right = true; 
      break;
  }
});

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case "ArrowUp": 
      moveBy.forward = false; 
      break;
    case "ArrowDown": 
      moveBy.backward = false; 
      break;
    case "ArrowLeft": 
      moveBy.left = false; 
      break;
    case "ArrowRight": 
      moveBy.right = false; 
      break;
  }
});

// Arrow Keys Movement of the Camera
function pointerControlsMovement(dt) {
  const speed = 0.25;
  
  if (moveBy.forward) {
    pointerLockControls.moveForward(speed);
  }
  if (moveBy.backward) {
    pointerLockControls.moveForward(-speed);
  }
  if (moveBy.right) {
    pointerLockControls.moveRight(speed);
  }
  if (moveBy.left) {
    pointerLockControls.moveRight(-speed);
  }
}

// Outer Animation Control Loop
function animate() {
  requestAnimationFrame(animate);
  let dt = clock.getDelta() * timeScale;

  if (freeCamera) {
    pointerControlsMovement();
  } else {
    orbitalControls.update();
  }

  updateWaveSpawner(dt);
  animateZombies(dt);
  for (const z of zombies) {
    if (z.healthBar && z.mesh) {
      z.healthBar.lookAt(camera.position);
    }
  }
  updateTowers(dt);
  updateProjectiles(dt);

  const HEALTH_DECREMENT = 20;
  for (let i = zombies.length - 1; i >= 0; i--) {
    const zombie = zombies[i];
    if (!zombie.mesh || !zombie.boundingBox) continue;

    zombie.boundingBox.setFromObject(zombie.mesh);

    if (zombie.boundingBox.intersectsBox(fenceBoundingBox)) {
      scene.remove(zombie.mesh);
      zombies.splice(i, 1);

      currentHealth -= HEALTH_DECREMENT;
      updateHealthBar(currentHealth, totalHealth);

      if (currentHealth <= 0 && !gameOver) {
        triggerGameOver();
      }
    }
  }

  if (gamePhase === "zombie") {
    setNightMode();
    checkWaveComplete();
  }
  else if (gamePhase == "building") {
    setDayMode();
  }
    
  updateTowerPreview();

  renderer.render(scene, camera);
}

animate();

// Handler for Resizing Window
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.domElement.addEventListener('click', () => {
  if (freeCamera) {
    pointerLockControls.lock();
  }
});
