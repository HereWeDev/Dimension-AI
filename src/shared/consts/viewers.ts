import { ViewersType } from "@/src/app/types/viewer";
import { useMainViewModels } from "../store/viewer/viewer.store";

export const Viewers: ViewersType = {
  MAIN: {
    name: "MAIN",
    useViewModels: useMainViewModels,
  },
};
