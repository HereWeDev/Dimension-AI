import styles from "./image.module.scss";

export default function Image({ ...props }) {
  const { src } = props;

  return (
    <div className="">
      <img src={src} alt="Image" className={styles.container} />
    </div>
  );
}
