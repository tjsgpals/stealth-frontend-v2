import { useEffect, useState } from "react";
import {
  getPersons,
  getPersonPhotos,
  changeRepresentative,
  addPerson,
} from "../api/api";
import styles from "./ViewerPage.module.css";
import VideoPanel from "../components/VideoPanel";
import PersonCard from "../components/PersonCard";
import PersonGalleryModal from "../components/PersonGalleryModal";
import AddPersonModal from "../components/AddPersonModal";
import { socket, connectViewer, disconnectViewer } from "../socket/socket";

function ViewerPage() {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [, setIsPhotosLoading] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [streamStatus, setStreamStatus] = useState("waiting");
  const [isServerConnected, setIsServerConnected] = useState(false);
  const [isReceiving, setIsReceiving] = useState(false);

  useEffect(() => {
    async function loadPersons() {
      try {
        const data = await getPersons();
        setPersons(data);
      } catch (error) {
        console.error("인물 목록 조회 실패:", error);
      }
    }

    loadPersons();
  }, []);

  useEffect(() => {
    const handleConnect = () => {
      console.log("Socket.IO 서버 연결 성공");
      setIsServerConnected(true);

      // 연결 및 재연결 시 viewer 역할 등록
      socket.emit("register_client", { role: "viewer" });
    };

    const handleDisconnect = () => {
      console.log("Socket.IO 서버 연결 종료");
      setIsServerConnected(false);
      setStreamStatus("waiting");
      setOriginalImage(null);
      setProcessedImage(null);
    };

    const handleOriginalFrame = (data) => {
      setOriginalImage(data.original_image);
    };

    const handleProcessedFrame = (data) => {
      setProcessedImage(data.result_image);
    };

    const handleStreamStatus = (data) => {
      setStreamStatus(data.status);

      if (data.status === "stopped") {
        setOriginalImage(null);
        setProcessedImage(null);
      }
    };

    const handleStreamError = (data) => {
      console.error("영상 처리 오류:", data.code, data.message);
    };

    const handleConnectError = (error) => {
      console.error("Socket.IO 연결 실패:", error.message);
      setIsServerConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("original_frame", handleOriginalFrame);
    socket.on("processed_frame", handleProcessedFrame);
    socket.on("stream_status", handleStreamStatus);
    socket.on("stream_error", handleStreamError);

    connectViewer();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("original_frame", handleOriginalFrame);
      socket.off("processed_frame", handleProcessedFrame);
      socket.off("stream_status", handleStreamStatus);
      socket.off("stream_error", handleStreamError);

      disconnectViewer();
    };
  }, []);

  const handleOpenGallery = async (person) => {
    setSelectedPerson(person);
    setPhotos([]);
    setIsPhotosLoading(true);

    try {
      const data = await getPersonPhotos(person.person_id);
      setPhotos(data);
    } catch (error) {
      console.error("갤러리 사진 조회 실패:", error);
      alert("사진 목록을 불러오지 못했습니다.");
    } finally {
      setIsPhotosLoading(false);
    }
  };

  const handleChangeRepresentative = async (photoId) => {
    try {
      await changeRepresentative(photoId);

      const updatedPhotos = await getPersonPhotos(selectedPerson.person_id);
      setPhotos(updatedPhotos);

      const updatedPersons = await getPersons();
      setPersons(updatedPersons);

      alert("대표사진이 변경되었습니다.");
    } catch (error) {
      console.error("대표사진 변경 실패:", error);
      alert("대표사진 변경에 실패했습니다.");
    }
  };

  const handleAddPerson = async ({ name, photo }) => {
    try {
      // 1. 서버에 이름과 사진 전송
      await addPerson({ name, photo });

      // 2. 등록 인물 목록 새로 조회
      const updatedPersons = await getPersons();
      setPersons(updatedPersons);

      // 3. 팝업 닫기
      setIsAddModalOpen(false);

      alert("인물이 등록되었습니다.");
    } catch (error) {
      console.error("인물 등록 실패:", error);
      alert("인물 등록에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      {/* 상단 헤더 */}
      <header className={styles.header}>
        <div className={styles.logoWrapper}>
          <span className={styles.logoIcon}>S</span>
          <h1 className={styles.logo}>STEALTH</h1>
        </div>

        <span className={styles.serverStatus}>
          {isServerConnected ? "서버 연결됨" : "서버 연결 대기"}
        </span>
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

            <span className={styles.statusBadge}>
              {streamStatus === "streaming"
                ? "송출 중"
                : streamStatus === "processing"
                  ? "처리 중"
                  : "대기 중"}
            </span>
          </div>

          <div className={styles.videoArea}>
            <VideoPanel
              type="original"
              image={originalImage}
              status={streamStatus}
            />
          </div>

          <button
            type="button"
            className={styles.videoButton}
            onClick={() => socket.emit("start_stream")}
            disabled={!isServerConnected}
          >
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

            <span className={styles.statusBadge}>
              {streamStatus === "streaming"
                ? "송출 중"
                : streamStatus === "processing"
                  ? "처리 중"
                  : "대기 중"}
            </span>
          </div>

          <div className={styles.videoArea}>
            <VideoPanel
              type="processed"
              image={isReceiving ? processedImage : null}
              status={isReceiving ? streamStatus : "waiting"}
            />
          </div>

          <button
            type="button"
            className={styles.videoButton}
            onClick={() => setIsReceiving(true)}
            disabled={!isServerConnected}
          >
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
                onClick={() => handleOpenGallery(person)}
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
          photos={photos}
          onClose={() => setSelectedPerson(null)}
          onChangeRepresentative={handleChangeRepresentative}
        />
      )}

      {isAddModalOpen && (
        <AddPersonModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddPerson}
        />
      )}
    </div>
  );
}

export default ViewerPage;
