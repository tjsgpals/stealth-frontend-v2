
import styles from "./StartPage.module.css";

function StartPage({ onStart }) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.logo}>STEALTH</h1>

        <button
          type="button"
          className={styles.startButton}
          onClick={onStart}
        >
          START
        </button>
      </div>

      {/* 배경 */}
      <div className={`${styles.square} ${styles.square1}`} />
      <div className={`${styles.square} ${styles.square2}`} />
      <div className={`${styles.square} ${styles.square3}`} />
      <div className={`${styles.square} ${styles.square4}`} />
    </div>
  );
}

export default StartPage;
