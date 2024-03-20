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

// 삭제 버튼 누르면 뜨는 모달창
document.addEventListener("DOMContentLoaded", function () {
  const deleteBtn = document.querySelector("button.compose-temporary-storage");
  const modalWrap = document.querySelector(".delete-modal-wrap");

  deleteBtn.addEventListener("click", function () {
    modalWrap.style.display = "flex";
  });

  const cancelButton = document.querySelector(".modal-cancel button");
  const confirmButton = document.querySelector(".modal-confirm button");

  cancelButton.addEventListener("click", function () {
    modalWrap.style.display = "none";
  });

  confirmButton.addEventListener("click", function () {
    modalWrap.style.display = "none";
  });
});

// 기존내용이 수정될때 수정 버튼이 바뀐다.
// 수정 버튼 요소를 가져옵니다.
const editButton = document.querySelector("button.compose-storage");

// 제목과 내용을 감시할 요소들을 가져옵니다.
const titleInput = document.querySelector("input.compose-title");
const contentTextarea = document.querySelector("textarea.compose-content");

// 기존 제목과 내용을 가져옵니다.
const originalTitle = titleInput.value.trim();
const originalContent = contentTextarea.value.trim();

// 제목과 내용이 변경될 때마다 호출되는 함수
function checkForChanges() {
  // 현재 제목과 내용의 값
  const currentTitle = titleInput.value.trim();
  const currentContent = contentTextarea.value.trim();

  // 수정 여부를 확인하여 수정 버튼의 상태를 변경합니다.
  if (currentTitle !== originalTitle || currentContent !== originalContent) {
    editButton.classList.add("compose-storage-checked");
    editButton.disabled = false;
  } else {
    editButton.classList.remove("compose-storage-checked");
    editButton.disabled = true;
  }
}

// 제목과 내용의 변경을 감시합니다.
titleInput.addEventListener("input", checkForChanges);
contentTextarea.addEventListener("input", checkForChanges);
