import FileInputContainer from "@/features/landing/file-input-container/file-input-container.ui";
import styles from "./container.module.scss";
import IdeaInputContainer from "@/features/landing/idea-input-container/idea-input-container.ui";
import ImageInputContainer from "@/features/landing/image-input-container/image-input-container.ui";
import LandingMessage from "@/features/landing/landing-message/landing-message.ui";

export default function Container() {
  return (
    <div className={styles.container}>
      <LandingMessage />
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          overflowX: "auto",
        }}
      >
        <ImageInputContainer />
        <FileInputContainer />
      </div>
      <IdeaInputContainer />
    </div>
  );
}
