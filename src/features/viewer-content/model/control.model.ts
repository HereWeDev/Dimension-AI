import {
  CornerPositionsType,
  CornerType,
  FaceControlPositionsType,
  FaceNameType,
} from "@/src/app/types/control";
import * as THREE from "three";

export function setBoxVertices(
  center: THREE.Vector3,
  size: THREE.Vector3,
  cornerPositions: CornerPositionsType
) {
  Object.keys(cornerPositions).forEach((corner: string) => {
    const cornerPos = cornerPositions[corner].position;
    const bits = cornerPositions[corner].bits;

    cornerPos.x = center.x + bits[0] ? size.x / 2 : -size.x / 2;
    cornerPos.y = center.y + bits[1] ? size.y / 2 : -size.y / 2;
    cornerPos.z = center.z + bits[2] ? size.z / 2 : -size.z / 2;
  });
}

export function initializeCornerPositions() {
  const positions: CornerPositionsType = {};

  for (let i = 0; i < 8; i++) {
    /*
     * 3개의 bit로 corner의 위치를 나타낸다.
     * 각 bit의 0, 1은 center를 기준으로 -1, +1을 나타낸다.
     */
    const bits = [(i >> 2) & 1, (i >> 1) & 1, i & 1];

    const cornerName = [
      "bottom-back-left",
      "bottom-back-right",
      "bottom-front-left",
      "bottom-front-right",
      "top-back-left",
      "top-back-right",
      "top-front-left",
      "top-front-right",
    ][i];

    positions[cornerName] = {
      bits: bits,
      position: new THREE.Vector3(),
    };
  }

  return positions;
}

export function updateVertexControlPositions(
  corner: CornerType,
  cornerPositions: CornerPositionsType
) {
  const { bits, position } = corner;

  /*
   * bits[0]: left, right face에 속하는 corner의 x좌표를 업데이트한다.
   * bits[1]: top, bottom face에 속하는 corner의 y좌표를 업데이트한다.
   * bits[2]: back, front face에 속하는 corner의 z좌표를 업데이트한다.
   */
  Object.keys(cornerPositions).forEach((cornerName) => {
    const corner = cornerPositions[cornerName];

    if (corner.bits[0] === bits[0]) {
      corner.position.x = position.x;
    }

    if (corner.bits[1] === bits[1]) {
      corner.position.y = position.y;
    }

    if (corner.bits[2] === bits[2]) {
      corner.position.z = position.z;
    }
  });
}

export function updateFaceControlPositions(
  faceControlPositions: FaceControlPositionsType,
  cornerPositions: CornerPositionsType
) {
  Object.keys(faceControlPositions).forEach((faceName) => {
    const facePos = faceControlPositions[faceName];

    Object.keys(cornerPositions).forEach((cornerName) => {
      const corner = cornerPositions[cornerName];
      const bitIndex = getBitIndex(faceName as FaceNameType);

      if (
        bitIndex !== -1 &&
        corner.bits[bitIndex] ===
          (faceName === "left" || faceName === "bottom" || faceName === "back"
            ? 0
            : 1)
      ) {
        facePos.add(corner.position);
      }
    });

    facePos.divideScalar(5);
  });
}

export function getSameFaceCorners(
  faceName: FaceNameType,
  cornerPositions: CornerPositionsType
) {
  return Object.values(cornerPositions)
    .filter(({ bits }) => {
      switch (faceName) {
        case "left":
          return bits[0] === 0;
        case "right":
          return bits[0] === 1;
        case "top":
          return bits[1] === 1;
        case "bottom":
          return bits[1] === 0;
        case "front":
          return bits[2] === 1;
        case "back":
          return bits[2] === 0;
        default:
          return false;
      }
    })
    .map(({ bits, position }) => ({ bits, position: position }))
    .sort((a, b) => {
      if (a.bits[0] !== b.bits[0]) {
        return a.bits[0] - b.bits[0];
      }

      if (a.bits[1] !== b.bits[1]) {
        return a.bits[1] - b.bits[1];
      }

      return a.bits[2] - b.bits[2];
    });
}

export function getBitIndex(faceName: FaceNameType) {
  /*
   * cornerPosition bits array의 각 index를 통해 어떤 face에 속하는지 알 수 있다.
   * bits[0]: left, right face 포함 여부
   * bits[1]: bottom, top face 포함 여부
   * bits[2]: back, front face 포함 여부
   */
  switch (faceName) {
    case "left":
    case "right":
      return 0;
    case "bottom":
    case "top":
      return 1;
    case "back":
    case "front":
      return 2;
    default:
      return -1;
  }
}
