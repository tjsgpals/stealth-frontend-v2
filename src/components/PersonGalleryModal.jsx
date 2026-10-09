
import { useState } from "react";
import styles from "./PersonGalleryModal.module.css";

function PersonGalleryModal({
  person,
  photos = [],
  onClose,
  onChangeRepresentative,
}) {
  const [selectedPhotoId, setSelectedPhotoId] = useState(null);

  if (!person) return null;

  // 현재 대표사진 찾기
  const representativePhoto = photos.find(
    (photo) => photo.is_representative === true
  );

  // 사용자가 선택한 사진
  const selectedPhoto = photos.find(
    (photo) => photo.photo_id === selectedPhotoId
  );

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={`${person.name} 사진 갤러리`}
      >
        {/* 상단 제목 */}
        <header className={styles.header}>
          <div>
            <h2 className={styles.title}>{person.name}</h2>
            <p className={styles.subtitle}>등록 사진</p>
          </div>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="갤러리 닫기"
          >
            ×
          </button>
        </header>

        {/* 인물 기본 정보 */}
        <section className={styles.profileSection}>
          <div className={styles.representativeArea}>
            {representativePhoto ? (
              <img
                src={representativePhoto.image_url}
                alt={`${person.name} 대표사진`}
                className={styles.representativeImage}
              />
            ) : (
              <span className={styles.emptyPhoto}>
                대표사진 없음
              </span>
            )}

            {representativePhoto && (
              <span className={styles.representativeLabel}>
                ★ 대표사진
              </span>
            )}
          </div>

          <div className={styles.profileInfo}>
            <span className={styles.infoLabel}>이름</span>
            <strong className={styles.personName}>
              {person.name}
            </strong>
          </div>
        </section>

        {/* 사진 갤러리 */}
        <section className={styles.gallerySection}>
          {photos.length === 0 ? (
            <div className={styles.emptyGallery}>
              등록된 사진이 없습니다.
            </div>
          ) : (
            <div className={styles.photoGrid}>
              {photos.map((photo) => (
                <button
                  key={photo.photo_id}
                  type="button"
                  className={`${styles.photoItem} ${
                    selectedPhotoId === photo.photo_id
                      ? styles.selected
                      : ""
                  }`}
                  onClick={() =>
                    setSelectedPhotoId(photo.photo_id)
                  }
                >
                  <img
                    src={photo.image_url}
                    alt={`${person.name} 등록 사진`}
                    className={styles.galleryImage}
                  />

                  {photo.is_representative && (
                    <span className={styles.star}>★</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 대표사진 변경 버튼 */}
        {selectedPhoto &&
          !selectedPhoto.is_representative && (
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.changeButton}
                onClick={() =>
                  onChangeRepresentative?.(selectedPhoto.photo_id)
                }
              >
                대표사진으로 설정
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default PersonGalleryModal;