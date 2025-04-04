import styles from "./landing-message.module.scss";

export default function LandingMessage() {
  return (
    <div className={styles.container}>
      <div>Welcome back 👋</div>
      <div>What’s on your mind today?</div>
    </div>
  );
}
