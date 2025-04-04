import styles from "./icon-button.module.scss";
import Icon from "@/shared/ui/icon/icon.ui";

export default function IconButton({ ...props }) {
  const { name, status, backgroundColor, onClick } = props;

  return (
    <button
      className={`${styles.container} ${styles[status]} ${styles[backgroundColor]}`}
      onClick={onClick}
    >
      <div className={styles.icon}>
        <Icon name={name} />
      </div>
    </button>
  );
}
