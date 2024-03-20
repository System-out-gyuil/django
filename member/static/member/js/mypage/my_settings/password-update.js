// 마이페이지/설정/비밀번호 변경 js 파일

/*
    입력창 에러 이벤트 처리(keyup, blur)

    비밀번호(new-password 클래스) - 영문 + 숫자 8자리 이상 15자리 이하
    비밀번호 확인(password-confirm 클래스) - 비밀번호와 동일한 값인지 비교

    에러 발생 시
        - input 태그에 error 클래스 추가
        - input 아래에 있는 에러 텍스트(div) 태그의 display = block으로 변경
*/

// 필요한 객체 가져오기
const passwordInput = document.querySelector(".new-password");
const confirmInput = document.querySelector(".password-confirm");

const passwordErrorTag = document.querySelector(".password-error-text");
const confirmErrorTag = document.querySelector(".confirm-error-text");

// 에러 상황에 표시할 메세지 변수화 - 비밀번호 입력창만
const mustNeededMsg = "필수 입력 항목입니다."; // 미입력 오류
const passwordErrorMsg =
  "비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다."; // 비밀번호 양식 오류

// 비밀번호 양식
const passwordRegex = /^[A-Za-z0-9]{8,15}$/;

// 비밀번호 입력창 - keyup 이벤트
passwordInput.addEventListener("keyup", (e) => {
  // 만약 키가 눌린 시점에 값이 없거나 양식이 안 지켜져 있다면
  if (!e.target.value || !passwordRegex.test(e.target.value)) {
    // 입력창에 error 클래스 추가
    // 클래스의 중첩을 막기 위해, 기존에 error 클래스가 없는지부터 확인
    if (!e.target.classList.contains("error")) {
      e.target.classList.add("error");
    }

    // 입력창 아래의 에러 텍스트 표시
    // 값 없음 - "필수 입력", 값은 있음 - "양식 오류"
    const errorMsg = !e.target.value ? mustNeededMsg : passwordErrorMsg;

    // 위 분기로 얻은 에러 메세지를 포함한 내용을 div 태그에 추가
    passwordErrorTag.innerHTML = `<img src="../../../staticfiles/images/settings/error-icon.svg"
                                    class="error-icon"/>
                                    ${errorMsg}`;

    // 에러 텍스트 표시
    passwordErrorTag.style.display = "block";

    // 아래쪽 경우의 수(양식에 맞춰 입력한 경우) 실행 안하고 함수 종료
    return;
  }
  // 만약 양식에 맞춰서 값을 입력한 경우

  // 입력창의 error 클래스 삭제
  e.target.classList.remove("error");

  // 에러 텍스트 숨김
  passwordErrorTag.style.display = "none";
});

// 비밀번호 입력창 - blur 이벤트
// keyup 이벤트와 구조 동일
passwordInput.addEventListener("blur", (e) => {
  if (!e.target.value || !passwordRegex.test(e.target.value)) {
    if (!e.target.classList.contains("error")) {
      e.target.classList.add("error");
    }

    const errorMsg = !e.target.value ? mustNeededMsg : passwordErrorMsg;
    passwordErrorTag.innerHTML = `<img src="../../../staticfiles/images/settings/error-icon.svg"
                                    class="error-icon"/>
                                    ${errorMsg}`;
    passwordErrorTag.style.display = "block";

    return;
  }
  e.target.classList.remove("error");
  passwordErrorTag.style.display = "none";
});

// 비밀번호 확인 입력창 - keyup 이벤트
confirmInput.addEventListener("keyup", (e) => {
  // 키가 눌릴 때마다 비밀번호 입력창의 현재 value를 변수에 할당
  let correctValue = passwordInput.value;

  // 만약 키가 눌린 시점에 값이 없거나 다르다면
  if (!e.target.value || e.target.value !== correctValue) {
    // 입력창에 error 클래스 추가
    // 클래스의 중첩을 막기 위해, 기존에 error 클래스가 없는지부터 확인
    if (!e.target.classList.contains("error")) {
      e.target.classList.add("error");
    }

    // 에러 텍스트 표시
    confirmErrorTag.style.display = "block";

    // 아래쪽 경우의 수(value가 일치한 경우) 실행 안하고 함수 종료
    return;
  }
  // value가 일치한 경우
  // 입력창의 error 클래스 삭제
  e.target.classList.remove("error");

  // 에러 텍스트 숨김
  confirmErrorTag.style.display = "none";
});

// 비밀번호 확인 입력창 - blur 이벤트
// keyup 이벤트와 구조 동일
confirmInput.addEventListener("blur", (e) => {
  let correctValue = passwordInput.value;

  if (!e.target.value || e.target.value !== correctValue) {
    if (!e.target.classList.contains("error")) {
      e.target.classList.add("error");
    }

    confirmErrorTag.style.display = "block";

    return;
  }
  e.target.classList.remove("error");
  confirmErrorTag.style.display = "none";
});

/*
  강사 여부에 따라 강의 현황 메뉴 표시/숨김
*/

// 강사 여부
let isTeacher = false;

// 강의 현황메뉴 객체
const myClassMenu = document.querySelector(".teacher");

// 강사면 강의 현황 메뉴 표시, 아니면 숨김
if (isTeacher) {
  myClassMenu.style.display = "inline-block";
} else {
  myClassMenu.style.display = "none";
}
