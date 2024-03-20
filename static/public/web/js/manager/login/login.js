function updateButtonStatus() {
  let inputElements = document.querySelectorAll(
    ".main-login-id, .main-login-pw"
  );
  let buttonElement = document.querySelector(".main-login-button");

  let isAnyInputEmpty = Array.from(inputElements).some(
    (input) => input.value.trim() === ""
  );

  buttonElement.disabled = isAnyInputEmpty;
  buttonElement.style.backgroundColor = isAnyInputEmpty ? "#F2F4F5" : "#134F2C";
  buttonElement.style.cursor = isAnyInputEmpty ? "default" : "pointer";
  buttonElement.style.color = isAnyInputEmpty ? "black" : "white";
}

function togglePasswordVisibility() {
  var passwordInput = document.querySelector(".main-login-pw");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

const button = document.querySelector(".main-login-button");
const id = document.querySelector(".main-login-id");
const pw = document.querySelector(".main-login-pw");
const modal = document.querySelector("#admin-message-modal");
const backmodal = document.querySelector("#admin-message-modal-backdrop");

const canclebutton = document.querySelector(".admin-message-modal-left-button");

const adminId = "selleaf";
const adminPw = "1234"

// 로그인 버튼 - click 이벤트
button.addEventListener("click", (e) => {
  // // 임시 아이디비번
  // if ((id.value === "selleaf", pw.value === "1234")) {
  //   // 페이지 나오면 페이지이동 url
  //   window.location.href = "";
  //   return;
  // }

  // 아이디가 일치하지 않으면 함수 종료
  if (id.value !== adminId) {
    // 로그인 실패 시 모달창 표시
    modal.classList.remove("hidden");
    backmodal.classList.remove("hidden");

    // 버튼 비활성화
    button.disabled = true
    return;
  }

  // 비번이 일치하지 않아도 함수 종료
  if (pw.value !== adminPw) {
    // 로그인 실패 시 모달창 표시
    modal.classList.remove("hidden");
    backmodal.classList.remove("hidden");

    // 버튼 비활성화
    button.disabled = true
    return;
  }
  // 로그인 실패 시 form 태그에서 post 요청 보내면 안 됨

  // 로그인 성공했을 경우
  //
});

canclebutton.addEventListener("click", () => {
  modal.classList.add("hidden");
  backmodal.classList.add("hidden");
});

function applyStyles(inputElement, redBoxElement) {
  if (!inputElement.value.trim()) {
    redBoxElement.classList.remove("hidden");
    inputElement.style.border = "2px solid #CE201B";
    // placeholder 스타일 설정
    inputElement.style.paddingLeft = "18px";
    inputElement.style.paddingRight = "18px";
    inputElement.style.borderRadius = "8px";
  } else {
    redBoxElement.classList.add("hidden");
    inputElement.style.border = "";
    // placeholder 스타일 초기화
    inputElement.style.paddingLeft = "";
    inputElement.style.paddingRight = "";
    inputElement.style.borderRadius = "";
  }
}

// 아이디 미 입력시 나오는 텍스트
var inputElementTitle = document.querySelector(".main-login-id");
var redBoxElementTitle = document.getElementById("red-id");
inputElementTitle.addEventListener("input", function () {
  applyStyles(inputElementTitle, redBoxElementTitle);
});
inputElementTitle.addEventListener("blur", function () {
  applyStyles(inputElementTitle, redBoxElementTitle);
});

// 비밀번호 미 입력시 나오는 텍스트
var inputElementContent = document.querySelector(".main-login-pw");
var redBoxElementContent = document.getElementById("red-pw");
inputElementContent.addEventListener("input", function () {
  applyStyles(inputElementContent, redBoxElementContent);
});
inputElementContent.addEventListener("blur", function () {
  applyStyles(inputElementContent, redBoxElementContent);
});
