
const BASE_URL = "http://119.194.117.120:5000";

// 서버에서 받은 상대 이미지 경로를 절대 URL로 변환
const getImageUrl = (path) => {
  if (!path) return null;
  return new URL(path, BASE_URL).href;
};

// 1. 등록 인물 목록 조회
export async function getPersons() {
  const response = await fetch(`${BASE_URL}/api/persons`);

  if (!response.ok) {
    throw new Error("등록 인물 목록 조회 실패");
  }

  const result = await response.json();

  return result.data.map((person) => ({
    ...person,
    representative_image_url: getImageUrl(
      person.representative_image_url
    ),
  }));
}

// 2. 인물별 사진 목록 조회
export async function getPersonPhotos(personId) {
  const response = await fetch(
    `${BASE_URL}/api/persons/${encodeURIComponent(personId)}/photos`
  );

  if (!response.ok) {
    throw new Error("인물 사진 조회 실패");
  }

  const result = await response.json();

  return result.photos.map((photo) => ({
    ...photo,
    image_url: getImageUrl(photo.image_url),
  }));
}

// 3. 인물 신규 등록
export async function addPerson({ name, photo }) {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("photos", photo);

  const response = await fetch(`${BASE_URL}/api/persons`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("인물 등록 실패");
  }

  return response.json();
}

// 4. 대표 사진 변경
export async function changeRepresentative(photoId) {
  const response = await fetch(
    `${BASE_URL}/api/photos/${encodeURIComponent(photoId)}/representative`,
    { method: "PATCH" }
  );

  if (!response.ok) {
    throw new Error("대표 사진 변경 실패");
  }

  return response.json();
}