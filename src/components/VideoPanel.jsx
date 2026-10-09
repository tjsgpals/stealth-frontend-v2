
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
          {isOriginal ? (
            // 카메라 아이콘
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <path d="M4 7h4l2-2h4l2 2h4v12H4V7Z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
          ) : (
            // 모니터 아이콘
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="14" />
              <path d="M9 22h6M12 18v4" />
            </svg>
          )}

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