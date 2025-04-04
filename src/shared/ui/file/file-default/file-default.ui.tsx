import { FileIconInfo } from "@/shared/consts/fileIcon";
import FileIcon from "../file-icon/file-icon.ui";
import styles from "./file-default.module.scss";

export default function File({ ...props }) {
  const { fileType, name } = props;

  return (
    <div className={styles.container}>
      <FileIcon
        fileType={fileType}
        backgroundColor={FileIconInfo[fileType].backgroundColor}
      />
      <div>
        <div className={styles.name}>{name}</div>
        <div className={styles.file_type}>{fileType}</div>
      </div>
    </div>
  );
}
