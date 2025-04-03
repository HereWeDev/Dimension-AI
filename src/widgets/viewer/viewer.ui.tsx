import { ViewerProps } from "@/src/app/types/props";
import ToolBar from "@/src/features/tool-bar/tool-bar.ui";
import ViewerContent from "@/src/features/viewer-content/viewer-content.ui";

export default function Viewer({ ...props }: ViewerProps) {
  const { viewerName, mounted } = props;

  const viewerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    margin: 0,
    overflow: "hidden",
    borderRadius: "6px",
  };

  return (
    <>
      <ToolBar />
      <ViewerContent
        style={viewerStyle}
        viewerName={viewerName}
        mounted={mounted}
      />
    </>
  );
}
