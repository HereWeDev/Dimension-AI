import Icon from "../../icon/icon.ui";
import styles from "./file-icon.module.scss";

export default function FileIcon({ ...props }) {
  const { fileType, backgroundColor } = props;

  return (
    <div
      className={styles.container}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <div className={styles.icon}>
        <Icon name={fileType} />
      </div>
    </div>
  );
}
