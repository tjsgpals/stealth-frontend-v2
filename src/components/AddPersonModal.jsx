
import { useRef, useState, useEffect } from "react";
import styles from "./AddPersonModal.module.css";

function AddPersonModal({ onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  // 사진 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 사진 선택
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있습니다.");
      event.target.value = "";
      return;
    }

    // 이전 사진의 미리보기는 useEffect에서 정리
    const url = URL.createObjectURL(file);

    setPhoto(file);
    setPreviewUrl(url);
  };

  // 인물 등록
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name.trim() || !photo) return;

    // 추후 POST /api/persons 연결
    onSubmit?.({
      name: name.trim(),
      photo: photo,
    });
  };

  const canSubmit = name.trim() !== "" && photo !== null;

  return (
    <div className={styles.overlay}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label="인물 추가"
      >
        {/* 상단 */}
        <header className={styles.header}>
          <h2 className={styles.title}>인물 추가</h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </header>

        {/* 등록 폼 */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formBody}>
            {/* 이름 */}
            <label
              htmlFor="person-name"
              className={styles.label}
            >
              이름
            </label>

            <input
              id="person-name"
              type="text"
              className={styles.nameInput}
              placeholder="이름 입력"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={50}
            />

            {/* 사진 */}
            <label className={styles.label}>사진</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />

            <button
              type="button"
              className={styles.uploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="선택한 사진 미리보기"
                  className={styles.previewImage}
                />
              ) : (
                <div className={styles.uploadContent}>
                  <span className={styles.uploadIcon}>↑</span>
                  <span>사진 선택</span>
                </div>
              )}
            </button>
          </div>

          {/* 하단 버튼 */}
          <footer className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              취소
            </button>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!canSubmit}
            >
              등록
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}

export default AddPersonModal;