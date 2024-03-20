/*
  이메일, 비번 입력창

  - 2/17 수정

  에러 발생(값 입력 X) 시 .error(클래스) 추가 - 테두리 색상 변경

  비밀번호 입력창에 값이 없다면
    -> 이메일 창에 값 있는지 검사하고, 없다면 이메일 창에도 .error 추가
    -> 단, 에러 해제는 이메일 창 상관 없이 비번 창만 해제
*/
//
// // 이메일, 비번 입력창
//
//
//
// // 이메일 입력창 - blur 이벤트
// // keyup 이벤트와 기능 동일
// emailInput.addEventListener("blur", (e) => {
//   if (!e.target.value) {
//     if (!emailInput.classList.contains("error")) {
//       emailInput.classList.add("error");
//     }
//
//     return;
//   }
//   emailInput.classList.remove("error");
// });
//
// // 비밀번호 입력창 - keyup 이벤트
// // 값이 없다면, 이메일 입력창에도 값 있는지 동시에 검사
// passwordInput.addEventListener("keyup", (e) => {
//   // 입력값이 있는지 검사
//   if (!e.target.value) {
//     // 없다면 테두리 빨간색으로 변경
//     if (!passwordInput.classList.contains("error")) {
//       passwordInput.classList.add("error");
//     }
//
//     // 이메일 입력창에 값 있는지도 검사
//     if (!emailInput.value) {
//       // 이메일 입력창 테두리가 빨간색이 아닐 때만 error 추가
//       if (!emailInput.classList.contains("error")) {
//         emailInput.classList.add("error");
//       }
//     }
//
//     return;
//   }
//   // 값이 있다면 테두리 색상 원복
//   passwordInput.classList.remove("error");
// });
//
// // 비밀번호 입력창 - blur 이벤트
// passwordInput.addEventListener("blur", (e) => {
//   if (!e.target.value) {
//     if (!passwordInput.classList.contains("error")) {
//       passwordInput.classList.add("error");
//     }
//
//     if (!emailInput.value) {
//       if (!emailInput.classList.contains("error")) {
//         emailInput.classList.add("error");
//       }
//     }
//
//     return;
//   }
//   passwordInput.classList.remove("error");
// });
//
// /*
//   로그인 버튼 클릭 시
//
//   이메일과 비밀번호 입력창 검사 실행
//
//   이메일 입력창에 값이 없다면 - error 추가 및 focus
//   비번 입력창에 값이 없다면 - error 추가만
//
//
//   회원 정보는 나중에 DB와 연결해서 조회할 것이지만,
//   임시로 사용할 아이디와 비번을 설정해서 비교 검사
//
//   불일치(회원 정보 없음) 시, 화면 하단에 모달창으로 메세지 띄우기
// */
//
// // 로그인 버튼
// const loginButton = document.querySelector(".login-button");
//
// // 임시 이메일 및 비번
// const email = "test@test.com";
// const pw = "12345678";
//
// // 로그인 실패 시 뜨는 모달창
// const loginErrorModal = document.querySelector(".login-error-modal-wrap");
//
// // setTimeOut과 애니메이션을 쓰기 위한 변수 선언
// let timeoutId;
// let animationTarget;
//
// // 로그인 버튼 - click 이벤트
// loginButton.addEventListener("click", () => {
//   // 이메일, 비번 중 하나라도 입력값 없으면 if문 안쪽 코드 실행
//   if (!emailInput.value || !passwordInput.value) {
//     // 이메일에 입력값 없으면 테두리 빨간색 + focus
//     if (!emailInput.value) {
//       emailInput.classList.contains("error")
//         ? false
//         : emailInput.classList.add("error");
//
//       emailInput.focus();
//     }
//
//     // 비번에 입력값 없으면 테두리 빨간색으로 - 이메일 쪽과 별개로 검사
//     if (!passwordInput.value) {
//       passwordInput.classList.contains("error")
//         ? false
//         : passwordInput.classList.add("error");
//     }
//
//     return;
//   }
//
//   // 양쪽 모두 입력값 있으면 회원 정보와 일치하는 지 검사
//   if (emailInput.value !== email || passwordInput.value !== pw) {
//     // 비밀번호 input창 비우고, 테두리 빨간색으로 변경
//     passwordInput.value = "";
//
//     passwordInput.classList.contains("error")
//       ? false
//       : passwordInput.classList.add("error");
//
//     // 화면 하단에 모달창 표시
//     showPopup(loginErrorModal);
//     return;
//   }
//   // 이메일과 회원 정보가 모두 일치하면(조회에 성공하면) 메인 페이지로 이동
// });
//
// // 모달창 띄우기 함수
// function showPopup(target) {
//   // setTimeOut 해제
//   clearTimeout(timeoutId);
//
//   // 애니메이션 적용할 객체가 있을 경우 애니메이션 표시 취소부터 실행
//   if (animationTarget) animationTarget.classList.remove("show-animation");
//
//   // 애니메이션 적용 객체 = 함수의 인자(모달창)
//   animationTarget = target;
//
//   // 모달창에 표시되게 하는 애니메이션 효과 추가
//   animationTarget.classList.remove("hide-animation");
//   animationTarget.classList.add("show-animation");
//
//   // 3초 뒤에 모달창 숨기기 함수 실행
//   timeoutId = setTimeout(() => {
//     hidePopup();
//   }, 3000);
// }
//
// // 모달창 숨기기 함수
// function hidePopup() {
//   // 애니메이션 실행할 객체 없으면 아래 내용 무시
//   if (!animationTarget) return;
//
//   // 애니메이션 실행할 객체(모달창) 숨김
//   animationTarget.classList.remove("show-animation");
//   animationTarget.classList.add("hide-animation");
// }
