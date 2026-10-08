
import styles from "./PersonCard.module.css";

function PersonCard({ person, onClick }) {
  return (
    <button
      type="button"
      className={styles.personCard}
      onClick={() => onClick?.(person)}
    >
      {/* 대표사진 */}
      <div className={styles.photoArea}>
        {person.representative_image_url ? (
          <img
            src={person.representative_image_url}
            alt={`${person.name} 대표사진`}
            className={styles.photo}
          />
        ) : (
          <span className={styles.noPhoto}>
            사진 없음
          </span>
        )}
      </div>

      {/* 인물 이름 */}
      <span className={styles.name}>
        {person.name}
      </span>

      {/* 오른쪽 화살표 */}
      <span className={styles.arrow}>
        ›
      </span>
    </button>
  );
}

export default PersonCard;