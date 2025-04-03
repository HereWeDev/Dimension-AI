"use client";

import styles from "./page.module.scss";
import Container from "@/widgets/landing/container/container.ui";
import ProjectPanel from "@/widgets/general/project-panel/project-panel.ui";
import TopBar from "@/features/landing/top-bar/top-bar.ui";

export default function Home() {
  return (
    <div className={styles.container}>
      <ProjectPanel />
      <div className={styles.landing}>
        <TopBar />
        <Container />
      </div>
    </div>
  );
}
