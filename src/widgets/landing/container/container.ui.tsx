import styles from "./container.module.scss";
import IdeaInputContainer from "@/features/landing/idea-input-container/idea-input-container.ui";
import LandingMessage from "@/features/landing/landing-message/landing-message.ui";

export default function Container() {
  return (
    <div className={styles.container}>
      <LandingMessage />
      <IdeaInputContainer />
    </div>
  );
}
