
import styles from "./VideoPanel.module.css";

function VideoPanel({
  type = "original",
  image = null,
  status = "waiting",
}) {
  const isOriginal = type === "original";

  // 영상이 없을 때 표시할 문구
  const waitingText = isOriginal
    ? "카메라 대기 중"
    : "영상 수신 대기 중";

  return (
    <div
      className={`${styles.videoPanel} ${
        isOriginal ? styles.original : styles.processed
      }`}
    >
      {image ? (
        // 추후 서버에서 받은 실제 프레임 표시
        <img
          src={image}
          alt={isOriginal ? "원본 영상" : "AI 처리 영상"}
          className={styles.videoImage}
        />
      ) : status === "processing" && !isOriginal ? (
        // AI 처리 중 표시
        <div className={styles.message}>
          <div className={styles.loadingBars}>
            <span />
            <span />
            <span />
          </div>
          <p>영상 처리 중</p>
        </div>
      ) : (
        // 영상 연결 전 대기 화면
        <div className={styles.message}>
          <p>{waitingText}</p>
        </div>
      )}

      {/* 영상 화면 모서리 장식 */}
      <span className={`${styles.corner} ${styles.topLeft}`} />
      <span className={`${styles.corner} ${styles.topRight}`} />
      <span className={`${styles.corner} ${styles.bottomLeft}`} />
      <span className={`${styles.corner} ${styles.bottomRight}`} />
    </div>
  );
}

export default VideoPanel;