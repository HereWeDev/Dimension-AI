import ProfileImage from "@/shared/ui/profile-image/profile-image.ui";
import styles from "./top-bar.module.scss";
import PopoverMenu from "@/shared/ui/popover-menu/popover-menu.ui";
import IconButton from "@/shared/ui/icon-button/icon-button.ui";

export default function TopBar({ ...props }) {
  const { isPanelClosed, togglePanel } = props;

  return (
    <div
      className={`${styles.container} ${
        isPanelClosed ? styles.space_between : ""
      }`}
    >
      {isPanelClosed ? (
        <IconButton
          name="SidebarSimple"
          status="square"
          onClick={togglePanel}
        />
      ) : null}
      <ProfileImage />
      <PopoverMenu />
    </div>
  );
}
