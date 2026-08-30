import * as THREE from "three";

// Derives a mesh's face normal (from its baked geometry, not a guessed
// world-space constant) and transforms it into world space. Used to make
// the camera approach flat panels (screens) perpendicular to their actual
// surface, regardless of how they were rotated during the Blender export.
export function getMeshWorldNormal(mesh: THREE.Mesh): THREE.Vector3 {
  const normalAttr = mesh.geometry.getAttribute("normal");
  const localNormal = new THREE.Vector3(0, 0, 1);
  if (normalAttr) {
    localNormal.fromBufferAttribute(normalAttr, 0);
  }

  mesh.updateMatrixWorld(true);
  return localNormal.transformDirection(mesh.matrixWorld).normalize();
}
