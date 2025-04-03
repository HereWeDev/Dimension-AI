import styles from "./idea-input-container.module.scss";
import IconButton from "@/shared/ui/icon-button/icon-button.ui";

export default function IdeaInputContainer() {
  return (
    <div className={styles.container}>
      <form className={styles.form}>
        <textarea
          type="text"
          placeholder="Describe your idea..."
          className={styles.input}
        />
      </form>

      <div className={styles.bottom}>
        <IconButton name="Plus" status="round" backgroundColor="default" />
        <IconButton name="ArrowRight" status="round" backgroundColor="white" />
      </div>
    </div>
  );
}
