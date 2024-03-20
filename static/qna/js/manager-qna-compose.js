// 제목 눌렀을때 칸 테두리 생기기
const titleBar = document.querySelector("label.compose-title");

document.addEventListener("click", (e) => {
  if (e.target.closest("label.compose-title")) {
    titleBar.classList.add("compose-content-checked");
    return;
  }
  titleBar.classList.remove("compose-content-checked");
});

// 콘텐츠 작성하면 아래 0자에서 입력할때마다 올라가기
// 텍스트 영역 요소를 가져옵니다.
const textarea = document.querySelector("textarea.compose-content");

// 글자수를 표시할 요소를 가져옵니다.
const charCountDisplay = document.querySelector("div.compose-content-bottom");

// 현재 textarea 안의 글자 수를 세서 화면에 뿌리는 함수
const countText = () => {
  // 입력된 텍스트의 길이를 가져옵니다.
  const textLength = textarea.value.length;

  // 글자수를 표시할 요소에 글자수를 표시합니다.
  charCountDisplay.textContent = textLength + "자";
}

// 페이지가 열렸을 때 위 함수 사용
countText();

// 텍스트 영역의 입력 이벤트를 감지하여 처리합니다.
textarea.addEventListener("input", countText);

// 텍스트 영역의 값이 변경될 때도 처리합니다.
textarea.addEventListener("change", countText);

// 임시저장, 게시 버튼 js 코드
// 텍스트 입력 필드 및 버튼 요소를 가져옵니다.
const titleInput = document.querySelector("input.compose-title");
const contentTextarea = document.querySelector("textarea.compose-content");
const temporaryStorageBtn = document.querySelector(
  "button.compose-temporary-storage"
);
const storageBtn = document.querySelector("button.compose-storage");
const savedBtn = document.querySelector("button.button-saved-wrap");

// 입력 필드가 변경될 때마다 호출되는 함수
function updateButtonState() {
  // 제목 및 콘텐츠 입력 여부 확인
  const titleEntered = titleInput.value.trim() !== "";
  const contentEntered = contentTextarea.value.trim() !== "";

  // 임시저장 버튼 상태 업데이트
  if (titleEntered || contentEntered) {
    temporaryStorageBtn.classList.add("compose-temporary-storage-checked");
    temporaryStorageBtn.removeAttribute("disabled"); // disable 제거
  } else {
    temporaryStorageBtn.classList.remove("compose-temporary-storage-checked");
    temporaryStorageBtn.setAttribute("disabled", "disabled"); // disable 추가
  }

  // 게시 버튼 상태 업데이트
  if (titleEntered && contentEntered) {
    storageBtn.classList.add("compose-storage-checked");
    storageBtn.removeAttribute("disabled"); // disable 제거
  } else {
    storageBtn.classList.remove("compose-storage-checked");
    storageBtn.setAttribute("disabled", "disabled"); // disable 추가
  }

  // 저장됨 버튼 상태 업데이트
  if (titleEntered || contentEntered) {
    if (savedBtn.style.display === "flex") {
      // 저장됨 버튼이 표시되어 있으면 임시저장 버튼을 표시합니다.
      temporaryStorageBtn.style.display = "flex";
      savedBtn.style.display = "none";
    }
  } else {
    // 제목과 콘텐츠 입력이 모두 없으면 임시저장 버튼을 표시합니다.
    temporaryStorageBtn.style.display = "flex";
    savedBtn.style.display = "none";
  }
}

// 임시저장 버튼 클릭 시 실행되는 함수
temporaryStorageBtn.addEventListener("click", function () {
  // 임시저장 버튼을 숨기고 저장됨 버튼을 표시합니다.
  temporaryStorageBtn.style.display = "none";
  savedBtn.style.display = "flex";
});

// 텍스트 입력 필드에 이벤트 리스너 추가
titleInput.addEventListener("input", updateButtonState);
contentTextarea.addEventListener("input", updateButtonState);

// 초기 버튼 상태 설정
updateButtonState();
