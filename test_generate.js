const { Document, NodeIO } = require('@gltf-transform/core');
const fs = require('fs');

async function main() {
  const doc = new Document();
  const buffer = doc.createBuffer();
  
  // Create material
  const mat = doc.createMaterial('Titanium_PBR')
    .setBaseColorFactor([0.85, 0.88, 0.92, 1.0])
    .setMetallicFactor(0.9)
    .setRoughnessFactor(0.25);

  // Simple box positions
  const positions = new Float32Array([
    -1, -1,  1,   1, -1,  1,   1,  1,  1,  -1,  1,  1,
    -1, -1, -1,  -1,  1, -1,   1,  1, -1,   1, -1, -1,
  ]);
  const indices = new Uint16Array([
    0, 1, 2,  0, 2, 3,
    4, 5, 6,  4, 6, 7,
  ]);

  const posAcc = doc.createAccessor('positions')
    .setType('VEC3')
    .setArray(positions)
    .setBuffer(buffer);

  const indAcc = doc.createAccessor('indices')
    .setType('SCALAR')
    .setArray(indices)
    .setBuffer(buffer);

  const prim = doc.createPrimitive()
    .setMaterial(mat)
    .setIndices(indAcc)
    .setAttribute('POSITION', posAcc);

  const mesh = doc.createMesh('Drone_Chassis').addPrimitive(prim);
  const node = doc.createNode('Drone_Root').setMesh(mesh);
  const scene = doc.createScene('MainScene').addChild(node);

  const io = new NodeIO();
  const glb = await io.writeBinary(doc);
  fs.writeFileSync('test.glb', glb);
  console.log('Successfully generated test.glb, size:', glb.length);
}

main().catch(console.error);
