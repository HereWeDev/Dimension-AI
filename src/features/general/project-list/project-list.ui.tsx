import styles from "./project-list.module.scss";
import ProjectListItem from "../project-list-item/project-list-item.ui";

export default function ProjectList() {
  return (
    <div className={styles.container}>
      <ProjectListItem />
      <ProjectListItem />
      <ProjectListItem />
      <ProjectListItem />
    </div>
  );
}
