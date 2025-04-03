import styles from "./popover-menu-item.module.scss";

export default function PopoverMenuItem({ ...props }) {
  const { icon, type, label, onClick, color } = props;

  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.icon}>
        <img src={`./icons/${icon}.svg`} alt="icon" />
      </div>
      <div
        className={styles.label}
        style={{
          color: color ? `var(${color})` : "var(--Text-Primary)",
        }}
      >
        {label}
      </div>
    </div>
  );
}
