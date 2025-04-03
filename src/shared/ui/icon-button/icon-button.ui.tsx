import styles from "./icon-button.module.scss";
import Icon from "@/shared/ui/icon/icon.ui";

export default function IconButton({ ...props }) {
  const { name, status, backgroundColor } = props;

  return (
    <button
      className={`${styles.container} ${styles[status]} ${styles[backgroundColor]}`}
    >
      <div className={styles.icon}>
        <Icon name={name} />
      </div>
    </button>
  );
}
