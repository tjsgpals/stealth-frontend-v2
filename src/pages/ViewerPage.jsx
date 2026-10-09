import { useState } from "react";
import styles from "./ViewerPage.module.css";
import VideoPanel from "../components/VideoPanel";
import PersonCard from "../components/PersonCard";
import PersonGalleryModal from "../components/PersonGalleryModal";
import AddPersonModal from "../components/AddPersonModal";

// 임시 인물 데이터
// 나중에 GET /api/persons 응답으로 교체
const dummyPersons = [
  { person_id: "person_01", name: "채현" },
  { person_id: "person_02", name: "은아" },
  { person_id: "person_03", name: "혜민" },
];

function ViewerPage() {
  const [persons] = useState(dummyPersons);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <span className={styles.logoIcon}>S</span>
          <h1 className={styles.logo}>STEALTH</h1>
        </div>

        <span className={styles.serverStatus}>서버 연결 대기</span>
      </header>

      {/* 메인 3분할 */}
      <main className={styles.main}>
        {/* 왼쪽: 원본 영상 */}
        <section className={styles.originalSection}>
          <div className={styles.videoHeadingRow}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionIcon}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 7h4l2-2h4l2 2h4v12H4V7Z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
              </span>

              <h2 className={styles.sectionTitle}>원본 영상</h2>
            </div>

            <span className={styles.statusBadge}>대기 중</span>
          </div>

          <div className={styles.videoArea}>
            <VideoPanel type="original" />
          </div>

          <button type="button" className={styles.videoButton}>
            영상 보내기
          </button>
        </section>

        {/* 가운데: AI 처리 영상 */}
        <section className={styles.processedSection}>
          <div className={styles.videoHeadingRow}>
            <div className={styles.sectionHeading}>
              <span className={styles.sectionIcon}>
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="4" width="18" height="14" />
                  <path d="M9 22h6M12 18v4" />
                </svg>
              </span>

              <h2 className={styles.sectionTitle}>처리 영상</h2>
            </div>

            <span className={styles.statusBadge}>대기 중</span>
          </div>

          <div className={styles.videoArea}>
            <VideoPanel type="processed" status="waiting" />
          </div>

          <button type="button" className={styles.videoButton}>
            영상 받기
          </button>
        </section>

        {/* 오른쪽: 등록 인물 */}
        <aside className={styles.personSection}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionIcon}>+</span>
            <h2 className={styles.sectionTitle}>등록된 인물</h2>
          </div>

          <div className={styles.personList}>
            {persons.map((person) => (
              <PersonCard
                key={person.person_id}
                person={person}
                onClick={() => setSelectedPerson(person)}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => setIsAddModalOpen(true)}
          >
            + 인물 추가
          </button>
        </aside>
      </main>

      {selectedPerson && (
        <PersonGalleryModal
          person={selectedPerson}
          photos={[]}
          onClose={() => setSelectedPerson(null)}
        />
      )}

      {isAddModalOpen && (
        <AddPersonModal onClose={() => setIsAddModalOpen(false)} />
      )}
    </div>
  );
}

export default ViewerPage;
