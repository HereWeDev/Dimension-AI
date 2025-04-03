import { useEffect, useState } from "react";
import PopoverMenuItem from "./popover-menu-item/popover-menu-item.ui";
import styles from "./popover-menu.module.scss";

export default function PopoverMenu() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
  }

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  return (
    <div className={styles.container}>
      {isDarkMode ? (
      <PopoverMenuItem
        onClick={toggleDarkMode}
        icon="Sun"
        label="Light mode"
        type="list"
      />
      ) : (
      <PopoverMenuItem
        onClick={toggleDarkMode}
        icon="Moon"
        label="Dark mode"
        type="list"
      />
      )}
      <PopoverMenuItem
      icon="SignOut"
      label="Sign out"
      type="list"
      color="--General-Red"
      />
    </div>
  );
}
