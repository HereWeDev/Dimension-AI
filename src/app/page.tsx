"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import Container from "@/widgets/landing/container/container.ui";
import ProjectPanel from "@/widgets/general/project-panel/project-panel.ui";
import TopBar from "@/features/landing/top-bar/top-bar.ui";

export default function Home() {
  const [isPanelClosed, setIsPanelClosed] = useState(false);

  const togglePanel = () => {
    setIsPanelClosed((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <ProjectPanel isPanelClosed={isPanelClosed} togglePanel={togglePanel} />
      <div className={styles.landing}>
        <TopBar isPanelClosed={isPanelClosed} togglePanel={togglePanel} />
        <Container />
      </div>
    </div>
  );
}
