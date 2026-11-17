const { Document, NodeIO } = require('@gltf-transform/core');
const fs = require('fs');
const path = require('path');

function createBox(doc, buffer, name, sx, sy, sz, material, ox=0, oy=0, oz=0) {
  const x = sx / 2, y = sy / 2, z = sz / 2;
  const positions = new Float32Array([
    // Front
    -x+ox, -y+oy,  z+oz,   x+ox, -y+oy,  z+oz,   x+ox,  y+oy,  z+oz,  -x+ox,  y+oy,  z+oz,
    // Back
    -x+ox, -y+oy, -z+oz,  -x+ox,  y+oy, -z+oz,   x+ox,  y+oy, -z+oz,   x+ox, -y+oy, -z+oz,
    // Top
    -x+ox,  y+oy, -z+oz,  -x+ox,  y+oy,  z+oz,   x+ox,  y+oy,  z+oz,   x+ox,  y+oy, -z+oz,
    // Bottom
    -x+ox, -y+oy, -z+oz,   x+ox, -y+oy, -z+oz,   x+ox, -y+oy,  z+oz,  -x+ox, -y+oy,  z+oz,
    // Right
     x+ox, -y+oy, -z+oz,   x+ox,  y+oy, -z+oz,   x+ox,  y+oy,  z+oz,   x+ox, -y+oy,  z+oz,
    // Left
    -x+ox, -y+oy, -z+oz,  -x+ox, -y+oy,  z+oz,  -x+ox,  y+oy,  z+oz,  -x+ox,  y+oy, -z+oz,
  ]);

  const normals = new Float32Array([
     0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
     0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1,
     0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
     0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,
     1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  ]);

  const uvs = new Float32Array([
    0,0, 1,0, 1,1, 0,1,
    0,0, 1,0, 1,1, 0,1,
    0,0, 1,0, 1,1, 0,1,
    0,0, 1,0, 1,1, 0,1,
    0,0, 1,0, 1,1, 0,1,
    0,0, 1,0, 1,1, 0,1,
  ]);

  const indices = new Uint16Array([
     0, 1, 2,  0, 2, 3,
     4, 5, 6,  4, 6, 7,
     8, 9,10,  8,10,11,
    12,13,14, 12,14,15,
    16,17,18, 16,18,19,
    20,21,22, 20,22,23
  ]);

  const posAcc = doc.createAccessor(name + '_pos').setType('VEC3').setArray(positions).setBuffer(buffer);
  const normAcc = doc.createAccessor(name + '_norm').setType('VEC3').setArray(normals).setBuffer(buffer);
  const uvAcc = doc.createAccessor(name + '_uv').setType('VEC2').setArray(uvs).setBuffer(buffer);
  const indAcc = doc.createAccessor(name + '_ind').setType('SCALAR').setArray(indices).setBuffer(buffer);

  const prim = doc.createPrimitive()
    .setMaterial(material)
    .setIndices(indAcc)
    .setAttribute('POSITION', posAcc)
    .setAttribute('NORMAL', normAcc)
    .setAttribute('TEXCOORD_0', uvAcc);

  const mesh = doc.createMesh(name).addPrimitive(prim);
  return doc.createNode(name).setMesh(mesh);
}

function createCylinder(doc, buffer, name, radius, height, segments, material, ox=0, oy=0, oz=0) {
  const positions = [];
  const normals = [];
  const uvs = [];
  const indices = [];

  const halfH = height / 2;

  // Barrel vertices
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);

    // Top vertex
    positions.push(ox + radius * cos, oy + halfH, oz + radius * sin);
    normals.push(cos, 0, sin);
    uvs.push(i / segments, 1);

    // Bottom vertex
    positions.push(ox + radius * cos, oy - halfH, oz + radius * sin);
    normals.push(cos, 0, sin);
    uvs.push(i / segments, 0);
  }

  for (let i = 0; i < segments; i++) {
    const top1 = i * 2;
    const bot1 = i * 2 + 1;
    const top2 = (i + 1) * 2;
    const bot2 = (i + 1) * 2 + 1;
    indices.push(top1, bot1, top2);
    indices.push(bot1, bot2, top2);
  }

  const baseIdx = (segments + 1) * 2;
  // Center top
  positions.push(ox, oy + halfH, oz);
  normals.push(0, 1, 0);
  uvs.push(0.5, 0.5);

  // Center bottom
  positions.push(ox, oy - halfH, oz);
  normals.push(0, -1, 0);
  uvs.push(0.5, 0.5);

  const topCenter = baseIdx;
  const botCenter = baseIdx + 1;

  for (let i = 0; i < segments; i++) {
    const top1 = i * 2;
    const top2 = (i + 1) * 2;
    indices.push(topCenter, top1, top2);

    const bot1 = i * 2 + 1;
    const bot2 = (i + 1) * 2 + 1;
    indices.push(botCenter, bot2, bot1);
  }

  const posAcc = doc.createAccessor(name + '_pos').setType('VEC3').setArray(new Float32Array(positions)).setBuffer(buffer);
  const normAcc = doc.createAccessor(name + '_norm').setType('VEC3').setArray(new Float32Array(normals)).setBuffer(buffer);
  const uvAcc = doc.createAccessor(name + '_uv').setType('VEC2').setArray(new Float32Array(uvs)).setBuffer(buffer);
  const indAcc = doc.createAccessor(name + '_ind').setType('SCALAR').setArray(new Uint16Array(indices)).setBuffer(buffer);

  const prim = doc.createPrimitive()
    .setMaterial(material)
    .setIndices(indAcc)
    .setAttribute('POSITION', posAcc)
    .setAttribute('NORMAL', normAcc)
    .setAttribute('TEXCOORD_0', uvAcc);

  const mesh = doc.createMesh(name).addPrimitive(prim);
  return doc.createNode(name).setMesh(mesh);
}

async function buildDrone(outputDir) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('DroneScene');

  // Materials
  const carbonMat = doc.createMaterial('CarbonFiber_Dark')
    .setBaseColorFactor([0.15, 0.16, 0.18, 1.0])
    .setMetallicFactor(0.4)
    .setRoughnessFactor(0.35);

  const goldTrimMat = doc.createMaterial('Anodized_Gold')
    .setBaseColorFactor([0.95, 0.75, 0.25, 1.0])
    .setMetallicFactor(0.95)
    .setRoughnessFactor(0.2);

  const opticLensMat = doc.createMaterial('Optic_Sensor_Cyan')
    .setBaseColorFactor([0.05, 0.85, 0.95, 1.0])
    .setMetallicFactor(0.1)
    .setRoughnessFactor(0.1)
    .setEmissiveFactor([0.1, 0.9, 1.0]);

  const root = doc.createNode('Drone_Root');
  scene.addChild(root);

  // Fuselage body
  const body = createBox(doc, buffer, 'Fuselage_Body', 1.2, 0.35, 1.6, carbonMat, 0, 0.4, 0);
  root.addChild(body);

  // Sensor Turret Gimbal
  const turretMount = createCylinder(doc, buffer, 'Gimbal_Mount', 0.22, 0.2, 16, goldTrimMat, 0, 0.15, 0.6);
  const sensorLens = createCylinder(doc, buffer, 'Sensor_Lens', 0.14, 0.15, 16, opticLensMat, 0, 0.15, 0.75);
  root.addChild(turretMount);
  root.addChild(sensorLens);

  // 4 Rotor Arms
  const armCoords = [
    { name: 'FrontRight', x: 1.1, z: 1.1 },
    { name: 'FrontLeft',  x: -1.1, z: 1.1 },
    { name: 'RearRight',  x: 1.1, z: -1.1 },
    { name: 'RearLeft',   x: -1.1, z: -1.1 }
  ];

  armCoords.forEach((arm) => {
    const armNode = createBox(doc, buffer, `Arm_${arm.name}`, 0.12, 0.08, 1.2, carbonMat, arm.x * 0.5, 0.4, arm.z * 0.5);
    const motor = createCylinder(doc, buffer, `Motor_${arm.name}`, 0.22, 0.25, 16, goldTrimMat, arm.x, 0.45, arm.z);
    const rotor = createBox(doc, buffer, `Rotor_${arm.name}`, 1.2, 0.02, 0.12, carbonMat, arm.x, 0.58, arm.z);
    root.addChild(armNode);
    root.addChild(motor);
    root.addChild(rotor);
  });

  // Landing skids
  const skidLeft = createBox(doc, buffer, 'Skid_Left', 0.08, 0.08, 1.8, goldTrimMat, -0.6, 0.04, 0);
  const skidRight = createBox(doc, buffer, 'Skid_Right', 0.08, 0.08, 1.8, goldTrimMat, 0.6, 0.04, 0);
  root.addChild(skidLeft);
  root.addChild(skidRight);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const filepath = path.join(outputDir, 'aeroscan_mark4_drone.glb');
  fs.writeFileSync(filepath, glb);
  console.log(`Exported: ${filepath} (${(glb.length / 1024).toFixed(1)} KB)`);
}

async function buildMedicalScanner(outputDir) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('ScannerScene');

  const medicalPlastic = doc.createMaterial('Polymer_SurgicalWhite')
    .setBaseColorFactor([0.94, 0.95, 0.96, 1.0])
    .setMetallicFactor(0.05)
    .setRoughnessFactor(0.2);

  const titaniumBezel = doc.createMaterial('Titanium_Bezel')
    .setBaseColorFactor([0.45, 0.48, 0.52, 1.0])
    .setMetallicFactor(0.92)
    .setRoughnessFactor(0.28);

  const oledDisplay = doc.createMaterial('OLED_Screen')
    .setBaseColorFactor([0.05, 0.08, 0.12, 1.0])
    .setMetallicFactor(0.1)
    .setRoughnessFactor(0.15)
    .setEmissiveFactor([0.1, 0.4, 0.8]);

  const gripRubber = doc.createMaterial('Rubber_ErgonomicGrip')
    .setBaseColorFactor([0.12, 0.14, 0.15, 1.0])
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.85);

  const root = doc.createNode('Scanner_Root');
  scene.addChild(root);

  // Main chassis console
  const consoleBody = createBox(doc, buffer, 'Chassis_Base', 1.4, 0.4, 1.1, medicalPlastic, 0, 0.3, 0);
  const screenBezel = createBox(doc, buffer, 'Screen_Housing', 1.1, 0.12, 0.8, titaniumBezel, 0, 0.55, -0.05);
  const screen = createBox(doc, buffer, 'Active_Display', 0.95, 0.02, 0.65, oledDisplay, 0, 0.62, -0.05);
  root.addChild(consoleBody);
  root.addChild(screenBezel);
  root.addChild(screen);

  // Diagnostic Handheld Transducer / Probe
  const probeHandle = createCylinder(doc, buffer, 'Transducer_Handle', 0.12, 0.7, 16, gripRubber, 0.9, 0.35, 0.2);
  const probeHead = createCylinder(doc, buffer, 'Transducer_Head', 0.18, 0.25, 20, titaniumBezel, 0.9, 0.75, 0.2);
  root.addChild(probeHandle);
  root.addChild(probeHead);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const filepath = path.join(outputDir, 'biopulse_prime_scanner.glb');
  fs.writeFileSync(filepath, glb);
  console.log(`Exported: ${filepath} (${(glb.length / 1024).toFixed(1)} KB)`);
}

async function buildTacticalMech(outputDir) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('MechScene');

  const armorPlate = doc.createMaterial('Military_Armor_Olive')
    .setBaseColorFactor([0.28, 0.34, 0.25, 1.0])
    .setMetallicFactor(0.65)
    .setRoughnessFactor(0.4);

  const steelJoint = doc.createMaterial('Hydraulic_Steel')
    .setBaseColorFactor([0.2, 0.22, 0.24, 1.0])
    .setMetallicFactor(0.9)
    .setRoughnessFactor(0.3);

  const goldCockpit = doc.createMaterial('Canopy_Polarized')
    .setBaseColorFactor([0.88, 0.7, 0.2, 1.0])
    .setMetallicFactor(0.9)
    .setRoughnessFactor(0.12);

  const root = doc.createNode('Mech_Root');
  scene.addChild(root);

  // Torso / Cockpit
  const torso = createBox(doc, buffer, 'Torso_Core', 1.0, 1.0, 1.2, armorPlate, 0, 1.6, 0);
  const canopy = createBox(doc, buffer, 'Cockpit_Canopy', 0.7, 0.5, 0.6, goldCockpit, 0, 1.8, 0.55);
  root.addChild(torso);
  root.addChild(canopy);

  // Pelvis
  const pelvis = createBox(doc, buffer, 'Pelvis_Assembly', 0.8, 0.4, 0.7, steelJoint, 0, 0.95, 0);
  root.addChild(pelvis);

  // Two articulated legs
  [-0.65, 0.65].forEach((xSide, i) => {
    const sideName = i === 0 ? 'Left' : 'Right';
    const hip = createCylinder(doc, buffer, `Hip_Actuator_${sideName}`, 0.18, 0.3, 16, steelJoint, xSide, 0.95, 0);
    const upperLeg = createBox(doc, buffer, `Femur_Piston_${sideName}`, 0.25, 0.8, 0.35, armorPlate, xSide, 0.55, 0.05);
    const foot = createBox(doc, buffer, `Foot_Pad_${sideName}`, 0.4, 0.15, 0.7, steelJoint, xSide, 0.08, 0.15);
    root.addChild(hip);
    root.addChild(upperLeg);
    root.addChild(foot);
  });

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const filepath = path.join(outputDir, 'vanguard_tactical_mech.glb');
  fs.writeFileSync(filepath, glb);
  console.log(`Exported: ${filepath} (${(glb.length / 1024).toFixed(1)} KB)`);
}

async function buildLuxuryWatch(outputDir) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene('WatchScene');

  const brushedTitanium = doc.createMaterial('Brushed_Titanium')
    .setBaseColorFactor([0.82, 0.84, 0.87, 1.0])
    .setMetallicFactor(0.95)
    .setRoughnessFactor(0.22);

  const roseGoldBezel = doc.createMaterial('RoseGold_Bezel')
    .setBaseColorFactor([0.92, 0.65, 0.52, 1.0])
    .setMetallicFactor(0.98)
    .setRoughnessFactor(0.18);

  const dialBlack = doc.createMaterial('Sunray_BlackDial')
    .setBaseColorFactor([0.06, 0.06, 0.07, 1.0])
    .setMetallicFactor(0.3)
    .setRoughnessFactor(0.3);

  const leatherStrap = doc.createMaterial('Alligator_Leather_Brown')
    .setBaseColorFactor([0.22, 0.12, 0.08, 1.0])
    .setMetallicFactor(0.0)
    .setRoughnessFactor(0.75);

  const root = doc.createNode('Watch_Root');
  scene.addChild(root);

  // Main Case & Bezel
  const caseNode = createCylinder(doc, buffer, 'Watch_Case', 0.9, 0.28, 32, brushedTitanium, 0, 0.15, 0);
  const bezelNode = createCylinder(doc, buffer, 'Outer_Bezel', 0.85, 0.06, 32, roseGoldBezel, 0, 0.31, 0);
  const dialNode = createCylinder(doc, buffer, 'Main_Dial', 0.75, 0.02, 32, dialBlack, 0, 0.33, 0);
  root.addChild(caseNode);
  root.addChild(bezelNode);
  root.addChild(dialNode);

  // Crown button
  const crown = createCylinder(doc, buffer, 'Winding_Crown', 0.12, 0.2, 16, roseGoldBezel, 0.98, 0.15, 0);
  root.addChild(crown);

  // Straps
  const strapTop = createBox(doc, buffer, 'Strap_Top', 0.7, 0.08, 1.2, leatherStrap, 0, 0.1, 1.3);
  const strapBottom = createBox(doc, buffer, 'Strap_Bottom', 0.7, 0.08, 1.2, leatherStrap, 0, 0.1, -1.3);
  root.addChild(strapTop);
  root.addChild(strapBottom);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  const filepath = path.join(outputDir, 'chronoprecision_titan_watch.glb');
  fs.writeFileSync(filepath, glb);
  console.log(`Exported: ${filepath} (${(glb.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const modelsDir = path.join(__dirname, 'public', 'models');
  fs.mkdirSync(modelsDir, { recursive: true });

  console.log('Generating 3D GLB assets...');
  await buildDrone(modelsDir);
  await buildMedicalScanner(modelsDir);
  await buildTacticalMech(modelsDir);
  await buildLuxuryWatch(modelsDir);
  console.log('All 3D assets generated successfully!');
}

main().catch(console.error);
