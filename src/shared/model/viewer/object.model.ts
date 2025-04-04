import * as THREE from "three";
import { BufferGeometryUtils } from "three/examples/jsm/Addons.js";

export function onModelLoad(object: THREE.Mesh) {
  centerObject(object);
  smoothObject(object);
  colorizeObject(object, 0x949494);
}

export function centerObject(object: THREE.Mesh) {
  object.position.set(0, 0, 0);
  object.lookAt(0, 0, 1);

  const box = new THREE.Box3();

  const callback = (obj: THREE.Mesh) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.geometry.computeBoundingBox();

      box.expandByPoint(
        mesh.localToWorld(mesh.geometry.boundingBox!.min.clone())
      );
      box.expandByPoint(
        mesh.localToWorld(mesh.geometry.boundingBox!.max.clone())
      );
    }
  };

  callback(object);
  const boxPos = box.getCenter(new THREE.Vector3());
  object.position.set(-boxPos.x, -boxPos.y, -boxPos.z);
}

function smoothObject(object: THREE.Mesh) {
  let geometry = object.geometry;

  geometry.deleteAttribute("normal");
  geometry = BufferGeometryUtils.mergeVertices(geometry);
  geometry.computeVertexNormals();
  
  object.geometry = geometry;
}

function colorizeObject(object: THREE.Mesh, color: number) {
  const material = new THREE.MeshStandardMaterial({
    color: color,
  });

  object.material = material;
}
