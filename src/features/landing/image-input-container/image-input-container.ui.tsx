import styles from "./image-input-container.module.scss";
import Image from "./image/image.ui";

export default function ImageInputContainer() {
  return (
    <div className={styles.container}>
      <Image src="./img.png" />
      <Image src="./img.png" />
      <Image src="./img.png" />
      <Image src="./img.png" />
      <Image src="./img.png" />
    </div>
  )
}