"use client";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
  }, [isDarkMode]);

  return (
    <div className={styles.test}>
      <div>asdf</div>

      <button
        onClick={() => {
          setIsDarkMode(!isDarkMode);
        }}
      >
        asfdadf
      </button>
    </div>
  );
}
