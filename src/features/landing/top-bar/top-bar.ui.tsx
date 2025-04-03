import ProfileImage from "@/shared/ui/profile-image/profile-image.ui";
import styles from "./top-bar.module.scss";
import PopoverMenu from "@/shared/ui/popover-menu/popover-menu.ui";

export default function TopBar() {
  return (
    <div className={styles.container}>
      <ProfileImage />
      <PopoverMenu />
    </div>
  );
}
