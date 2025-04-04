import { Model, ViewModelsStore } from "@/src/app/types/viewer";
import { create } from "zustand";
import * as THREE from "three";
import { CameraControlConfig, LightConfig } from "@/src/app/types/scene";
import { initializeScene } from "@/src/features/viewer-content/viewer-content.model";
import { ViewerMode } from "../../consts/mode";
import { ViewerModeStore, ViewerModeType } from "@/src/app/types/viewer";

function viewerStoreInitializer(
  set: (fn: (state: ViewModelsStore) => ViewModelsStore) => void,
  get: () => ViewModelsStore,
  lightConfig: LightConfig[],
  camConfig: CameraControlConfig
): ViewModelsStore {
  return {
    models: [],
    selectedModelIndex: 0,
    setViewerScene: (element: HTMLDivElement) => {
      initializeScene(element, lightConfig, camConfig);
    },
    getViewerScene: () => {
      return get();
    },
    getCurrentModel: () => {
      return get().models[get().selectedModelIndex];
    },
    addModel: (model: Model) => {
      if (get().models.length) {
        const object = get().models[get().selectedModelIndex].object;

        object.geometry.dispose();
      }

      get().models.push(model);
      get().selectedModelIndex = get().models.length - 1;
    },
  };
}

export const useMainViewModels = create<ViewModelsStore>((set, get) => {
  const lightConfig: LightConfig[] = [
    { pos: new THREE.Vector3(-1, 1, 1), intensity: 3 },
    { pos: new THREE.Vector3(1, 0, 1), intensity: 3 },
    { pos: new THREE.Vector3(0, 0.5, -1), intensity: 3 },
  ];

  const camConfig: CameraControlConfig = {
    pos: { x: 1, y: 1, z: 1 },
    look: { x: 0, y: 0, z: 0 },
  };

  return viewerStoreInitializer(set, get, lightConfig, camConfig);
});

export const useMode = create<ViewerModeStore>((set, get) => ({
  selected: ViewerMode.DEFAULT,
  getSelected: () => get().selected,
  setSelected: (mode: ViewerModeType) => set({ selected: mode }),
}));
