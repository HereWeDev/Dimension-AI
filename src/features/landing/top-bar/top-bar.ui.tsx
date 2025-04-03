import ProfileImage from "@/shared/ui/profile-image/profile-image.ui";
import styles from "./top-bar.module.scss";

export default function TopBar() {
  return (
    <div className={styles.container}>
      <ProfileImage />
    </div>
  );
}
