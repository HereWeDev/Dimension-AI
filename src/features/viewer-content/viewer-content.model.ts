import { CameraControlConfig, LightConfig } from "@/src/app/types/scene";
import { Model } from "@/src/app/types/viewer";
import { onModelLoad } from "@/src/shared/model/viewer/object.model";
import * as THREE from "three";
import { OrbitControls, STLLoader } from "three/examples/jsm/Addons.js";
import {
  getSameFaceCorners,
  initializeCornerPositions,
  setBoxVertices,
  updateFaceControlPositions,
  updateVertexControlPositions,
} from "./model/control.model";
import {
  useMode,
  useMainViewModels,
} from "@/src/shared/store/viewer/viewer.store";
import { ViewerMode } from "@/src/shared/consts/mode";
import {
  CornerPositionsType,
  FaceControlPositionsType,
  FaceNameType,
} from "@/src/app/types/control";

const scene = new THREE.Scene();

let renderer: THREE.WebGLRenderer;
let camera: THREE.PerspectiveCamera;
let orbit: OrbitControls;

const onUpPosition = new THREE.Vector2();
const onDownPosition = new THREE.Vector2();

const loader = new STLLoader();

let isDragging = false;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const initialControlPosition = new THREE.Vector3();

let volumeBox: THREE.Group;
let selectedObject: THREE.Mesh | null = null;
let vertexControls: THREE.Mesh[] = [];
let faceControls: THREE.Mesh[] = [];
let boundingBoxHelper: THREE.Box3Helper;
let boxFaces: THREE.Mesh[] = [];
let draggedControl: THREE.Mesh | null = null;

const cornerPositions: CornerPositionsType = initializeCornerPositions();

const faceControlPositions: FaceControlPositionsType = {
  left: new THREE.Vector3(),
  right: new THREE.Vector3(),
  bottom: new THREE.Vector3(),
  top: new THREE.Vector3(),
  back: new THREE.Vector3(),
  front: new THREE.Vector3(),
};

function createVolumeBox(object: THREE.Mesh) {
  if (volumeBox) {
    scene.remove(volumeBox);
    vertexControls = [];
    faceControls = [];
    boxFaces = [];
  }

  selectedObject = object;

  volumeBox = new THREE.Group();
  volumeBox.name = "volumeBox";

  const boundingBox = new THREE.Box3().setFromObject(object);
  const center = boundingBox.getCenter(new THREE.Vector3());
  const size = boundingBox.getSize(new THREE.Vector3());

  setBoxVertices(center, size, cornerPositions);
  updateFaceControlPositions(faceControlPositions, cornerPositions);

  const vertexGeometry = new THREE.BoxGeometry(0.025, 0.025, 0.025);
  const vertexMaterial = new THREE.MeshBasicMaterial({ color: 0x3f65ff });
  const faceControlMaterial = new THREE.MeshBasicMaterial({ color: 0x5a5c63 });

  Object.keys(cornerPositions).forEach((cornerName, index) => {
    const vertexMesh = new THREE.Mesh(vertexGeometry, vertexMaterial);
    const cornerInfo = cornerPositions[cornerName];

    vertexMesh.position.copy(cornerInfo.position);
    vertexMesh.userData = { type: "vertex", index: index, name: cornerName };
    vertexMesh.name = "vertex" + index;

    vertexControls.push(vertexMesh);
    volumeBox.add(vertexMesh);
  });

  Object.keys(faceControlPositions).forEach((faceName, index) => {
    const faceMesh = new THREE.Mesh(vertexGeometry, faceControlMaterial);
    faceMesh.userData = { type: "face", index: index, name: faceName };
    faceMesh.name = "face" + index;
    faceMesh.position.copy(faceControlPositions[faceName]);

    faceControls.push(faceMesh);
    volumeBox.add(faceMesh);
  });

  addFaceMesh();

  boundingBoxHelper = new THREE.Box3Helper(boundingBox, 0x3f65ff);
  volumeBox.add(boundingBoxHelper);

  volumeBox.position.copy(center);
  volumeBox.rotation.copy(object.rotation);

  scene.add(volumeBox);
  updateVolumeBox(true);

  render();
}

function addFaceMesh() {
  const faceMaterial = new THREE.MeshBasicMaterial({
    color: 0x3f65ff,
    transparent: true,
    opacity: 0.03,
    side: THREE.DoubleSide,
    vertexColors: false,
  });

  boxFaces.forEach((faceMesh) => {
    volumeBox.remove(faceMesh);
  });

  boxFaces = [];

  Object.keys(faceControlPositions).forEach((faceName, index) => {
    const faceCorners = getSameFaceCorners(
      faceName as FaceNameType,
      cornerPositions
    );

    const faceGeometry = new THREE.BufferGeometry();
    const vertices = faceCorners.map((corner) => corner.position);
    faceGeometry.setFromPoints(vertices);

    faceGeometry.setIndex([0, 1, 3, 2, 0, 3]);

    const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
    faceMesh.name = "faceMesh" + index;

    boxFaces.push(faceMesh);
    volumeBox.add(faceMesh);
  });

  render();
}

function updateVolumeBox(isInitialize: boolean = false) {
  if (!selectedObject || !volumeBox) return;

  const newBoundingBox = new THREE.Box3();
  const center = new THREE.Vector3();

  Object.keys(cornerPositions).forEach((cornerName) => {
    newBoundingBox.expandByPoint(cornerPositions[cornerName].position);
  });

  newBoundingBox.getCenter(center);

  const size = newBoundingBox.getSize(new THREE.Vector3());

  updateFaceControlPositions(faceControlPositions, cornerPositions);

  vertexControls.forEach((vertexMesh, index) => {
    const cornerPos = Object.values(cornerPositions)[index].position;
    vertexMesh.position.copy(cornerPos);
  });

  faceControls.forEach((faceControlMesh, index) => {
    const facePos = Object.values(faceControlPositions)[index];
    faceControlMesh.position.copy(facePos);
  });

  addFaceMesh();

  volumeBox.remove(boundingBoxHelper);
  boundingBoxHelper = new THREE.Box3Helper(newBoundingBox, 0x3f65ff);
  volumeBox.add(boundingBoxHelper);

  if (!isInitialize) {
    selectedObject.userData = {
      volumeBoxInfo: {
        center: Object.values(center).map((v) => v),
        width: size.x,
        height: size.y,
        length: size.z,
      },
    };
  }

  render();
}

export function onPointerDown(event: MouseEvent) {
  const viewerMode = useMode.getState().selected;

  if (viewerMode !== ViewerMode.VOLUMEBOX) {
    return;
  }

  onDownPosition.x = event.offsetX;
  onDownPosition.y = event.offsetY;

  mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  raycaster.params.Mesh.threshold = 5.0;

  let controlIntersects: THREE.Intersection[] = [];

  if (volumeBox) {
    const controlObjects = [...vertexControls, ...faceControls];

    controlIntersects = raycaster.intersectObjects(controlObjects, true);
  }

  if (controlIntersects.length > 0) {
    isDragging = true;
    draggedControl = controlIntersects[0].object as THREE.Mesh;
    initialControlPosition.copy(draggedControl.position.clone());

    orbit.enabled = false;
  }

  render();
}

export function onPointerMove(event: MouseEvent) {
  mouse.x = (event.offsetX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.offsetY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const controlObjects = [...vertexControls, ...faceControls];
  const controlIntersects = raycaster.intersectObjects(controlObjects, true);

  if (controlIntersects.length > 0) {
    window.document.body.style.cursor = "pointer";
  } else {
    window.document.body.style.cursor = "auto";
  }

  if (isDragging && draggedControl && selectedObject) {
    const dragPoint = new THREE.Vector3();
    const dragPlane = new THREE.Plane();

    dragPlane.setFromNormalAndCoplanarPoint(
      camera.getWorldDirection(new THREE.Vector3()).negate(),
      draggedControl.getWorldPosition(new THREE.Vector3())
    );

    raycaster.ray.intersectPlane(dragPlane, dragPoint);

    const worldInitialPos = new THREE.Vector3();
    volumeBox.localToWorld(worldInitialPos.copy(initialControlPosition));

    const delta = new THREE.Vector3().subVectors(dragPoint, worldInitialPos);

    const changeX = delta.x;
    const changeY = delta.y;
    const changeZ = delta.z;

    const name = draggedControl.userData.name;

    switch (draggedControl.userData.type) {
      case "vertex":
        const corner = cornerPositions[name];

        corner.position.x = initialControlPosition.x + changeX;
        corner.position.y = initialControlPosition.y + changeY;
        corner.position.z = initialControlPosition.z + changeZ;

        updateVertexControlPositions(corner, cornerPositions);
        break;
      case "face":
        const faceCorners = getSameFaceCorners(name, cornerPositions);

        faceCorners.forEach((corner) => {
          switch (name) {
            case "left":
            case "right":
              corner.position.x = initialControlPosition.x + changeX;
              break;
            case "bottom":
            case "top":
              corner.position.y = initialControlPosition.y + changeY;
              break;
            case "back":
            case "front":
              corner.position.z = initialControlPosition.z + changeZ;
              break;
          }
        });
        break;
    }

    updateVolumeBox();
  }

  render();
}

export function onPointerUp(event: MouseEvent) {
  onUpPosition.x = event.offsetX;
  onUpPosition.y = event.offsetY;

  if (isDragging) {
    isDragging = false;
    draggedControl = null;
    orbit.enabled = true;

    updateVolumeBox();
  }

  render();
}

function setRenderer(sceneElement: HTMLDivElement) {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(1);
  renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
}

function setScene(sceneElement: HTMLDivElement) {
  sceneElement.appendChild(renderer.domElement);

  scene.background = new THREE.Color(0x171719);

  const grid = new THREE.GridHelper(200, 1000, 0x292a2d, 0x292a2d);
  grid.rotateX(Math.PI / 2);

  scene.add(grid);
}

function setCamera(
  sceneElement: HTMLDivElement,
  cameraControlConfig: CameraControlConfig
) {
  const aspect = sceneElement.clientWidth / sceneElement.clientHeight;

  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

  const { pos, look } = cameraControlConfig;

  scene.background = new THREE.Color(0x171719);

  const grid = new THREE.GridHelper(200, 1000, 0x292a2d, 0x292a2d);
  grid.rotateX(Math.PI / 2);

  scene.add(grid);

  camera.position.set(pos.x, pos.y, pos.z);
  camera.lookAt(look.x, look.y, look.z);
  camera.up.set(0, 0, 1);
}

function setLight(lightConfig: LightConfig[]) {
  lightConfig.forEach((l) => {
    const light = new THREE.DirectionalLight(0xffffff, l.intensity);
    light.position.set(l.pos.x, l.pos.y, l.pos.z);

    scene.add(light);
  });
}

function setOrbitControls() {
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.update();
  orbit.addEventListener("change", render);
}

function render() {
  renderer.render(scene, camera);
}

export function addObject(
  id: string,
  url: string,
  addModel: (model: Model) => void
) {
  loader.load(url, (geometry: THREE.BufferGeometry) => {
    const object = new THREE.Mesh(geometry);
    scene.add(object);

    onModelLoad(object);

    const viewerMode = useMode.getState().selected;

    if (viewerMode === ViewerMode.VOLUMEBOX) {
      createVolumeBox(object);
    } else {
      scene.remove(volumeBox);
      scene.remove(boundingBoxHelper);
    }

    const { getCurrentModel } = useMainViewModels.getState();

    if (getCurrentModel()) {
      const { object } = getCurrentModel();
      scene.remove(object);
    }

    addModel({
      id,
      url,
      object,
    });

    render();
  });
}

export function onWindowResize(sceneElement: HTMLDivElement) {
  const aspect = sceneElement.clientWidth / sceneElement.clientHeight;

  camera.aspect = aspect;
  camera.updateProjectionMatrix();

  renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);

  render();
}

export function initializeScene(
  sceneElement: HTMLDivElement,
  lightConfig: LightConfig[],
  camConfig: CameraControlConfig
) {
  const viewerMode = useMode.getState().selected;
  const { getCurrentModel } = useMainViewModels.getState();

  if (viewerMode === ViewerMode.DEFAULT) {
    scene.remove(volumeBox);
    scene.remove(boundingBoxHelper);
  } else if (getCurrentModel()) {
    createVolumeBox(getCurrentModel().object);
  }

  if (camera && renderer && orbit && scene) {
    return;
  }

  setRenderer(sceneElement);
  setCamera(sceneElement, camConfig);
  setScene(sceneElement);
  setLight(lightConfig);
  setOrbitControls();

  render();
}
