import { useState } from "react";
import styles from "./ViewerPage.module.css";
import VideoPanel from "../components/VideoPanel";
import PersonCard from "../components/PersonCard";

// 임시 인물 데이터
// 나중에 GET /api/persons 응답으로 교체
const dummyPersons = [
  { person_id: "person_01", name: "채현" },
  { person_id: "person_02", name: "은아" },
  { person_id: "person_03", name: "혜민" },
];

function ViewerPage() {
  const [persons] = useState(dummyPersons);

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.logo}>STEALTH</h1>
        <span className={styles.serverStatus}>서버 연결 대기</span>
      </header>

      {/* 메인 3분할 */}
      <main className={styles.main}>
        {/* 왼쪽: 원본 영상 */}
        <section className={styles.originalSection}>
          <h2 className={styles.sectionTitle}>원본 영상</h2>

          <div className={styles.videoArea}>
            <VideoPanel type="original" />
          </div>

          <button type="button" className={styles.videoButton}>
            영상 보내기
          </button>
        </section>

        {/* 가운데: AI 처리 영상 */}
        <section className={styles.processedSection}>
          <h2 className={styles.sectionTitle}>처리 영상</h2>

          <div className={styles.videoArea}>
            <VideoPanel type="processed" status="waiting" />
          </div>

          <button type="button" className={styles.videoButton}>
            영상 받기
          </button>
        </section>

        {/* 오른쪽: 등록 인물 */}
        <aside className={styles.personSection}>
          <h2 className={styles.sectionTitle}>등록된 인물</h2>

          <div className={styles.personList}>
            {persons.map((person) => (
              <PersonCard key={person.person_id} person={person} />
            ))}
          </div>

          <button type="button" className={styles.addButton}>
            + 인물 추가
          </button>
        </aside>
      </main>
    </div>
  );
}

export default ViewerPage;
