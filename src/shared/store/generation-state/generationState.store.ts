import { GenerationStateStore } from "@/src/app/types/generationState";
import { create } from "zustand";
import { GenerationState } from "../../consts/generationState";

export const useGenerationState = create<GenerationStateStore>((set, get) => ({
  generationState: GenerationState.IDLE,
  startSpecState: () => set({ generationState: GenerationState.SPEC }),
  startShapeState: () => set({ generationState: GenerationState.SHAPE }),
  startVisualizeState: () =>
    set({ generationState: GenerationState.VISUALIZE }),
  setIdleState: () => set({ generationState: GenerationState.IDLE }),
  getIsSpecState: () => get().generationState === GenerationState.SPEC,
  getIsShapeState: () => get().generationState === GenerationState.SHAPE,
  getIsVisualizeState: () =>
    get().generationState === GenerationState.VISUALIZE,
  getIsIdleState: () => get().generationState === GenerationState.IDLE,
}));
