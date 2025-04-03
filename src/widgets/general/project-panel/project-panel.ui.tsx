import Icon from "@/shared/ui/icon/icon.ui";
import styles from "./project-panel.module.scss";
import ProjectList from "@/features/general/project-list/project-list.ui";
import IconButton from "@/shared/ui/icon-button/icon-button.ui";

export default function ProjectPanel() {
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.title}>
          <Icon name="Dimension" />
          <div>Dimension AI</div>
        </div>

        <div>
          <IconButton name="PencilSimple" status="square" />
          <IconButton name="SidebarSimple" status="square" />
        </div>
      </div>
      <ProjectList />
    </div>
  );
}
