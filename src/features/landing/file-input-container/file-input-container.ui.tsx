import File from "@/shared/ui/file/file-default/file-default.ui";
import styles from "./file-input-container.module.scss";

export default function FileInputContainer() {
  return (
    <div className={styles.container}>
      <File fileType="DWG" name="1asdiofjasdiofmiodasasdffoidasmiodf.dwg" />
      <File fileType="PDF" name="2.pdf" />
      <File fileType="DWG" name="3.dwg" />
      <File fileType="DWG" name="3.dwg" />
      <File fileType="PDF" name="3.dwg" />
      <File fileType="DWG" name="3.dwg" />
    </div>
  );
}
