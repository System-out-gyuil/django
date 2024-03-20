// 마이페이지/설정/알림 설정 js 파일

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
