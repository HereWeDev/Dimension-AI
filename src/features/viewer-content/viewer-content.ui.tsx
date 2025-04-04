import React, { useEffect, useRef } from "react";
import { Viewers } from "@/src/shared/consts/viewers";
import { ViewerContentProps } from "@/src/app/types/props";
import {
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onWindowResize,
} from "./viewer-content.model";
import { useMode } from "@/src/shared/store/viewer/viewer.store";

export default function ViewerContent({ ...props }: ViewerContentProps) {
  const { style, viewerName, mounted } = props;
  const { setViewerScene, addModel } = Viewers[viewerName].useViewModels();
  const { selected } = useMode();

  const sceneElement: React.RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sceneElement.current || !mounted) {
      return;
    }

    const currentSceneElement = sceneElement.current;
    setViewerScene(currentSceneElement);

    window.addEventListener(
      "resize",
      onWindowResize.bind(null, currentSceneElement)
    );

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mousemove", onPointerMove);

    return () => {
      window.removeEventListener(
        "resize",
        onWindowResize.bind(null, currentSceneElement)
      );

      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("mousemove", onPointerMove);
    };
  }, [addModel, setViewerScene, selected, mounted]);

  return <div style={style} ref={sceneElement}></div>;
}
