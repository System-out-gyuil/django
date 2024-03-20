// 마이페이지/프로필/노하우 js 파일

// 사이드 바 내 공유 버튼 눌렀을 때 모달창 표시

// 필요한 객체 가져오기
const shareModal = document.querySelector(".share-modal-wrap");

// 모달창 내 클립보드 버튼도 가져옴 - alert 표시용
const clipboardButton = document.querySelector(".cilpboard-button");

// 클립보드 버튼 - click 이벤트
// 클릭하면 alert 창 표시
clipboardButton.addEventListener("click", () => {
  alert("클립보드에 복사되었습니다.");
});

// click 이벤트 - 모달창 닫기
// 모달창 이외 아무 곳이나 클릭하면 모달창 닫힘
document.addEventListener("click", (e) => {
  // 만약 클릭한 곳의 상위 요소가 모달이 아닐 경우 = 모달 이외의 장소를 클릭한 경우
  if (!e.target.closest(".share-modal-wrap")) {
    // 상위 요소가 공유 버튼인 요소를 클릭했다면
    if (e.target.closest(".share-drop-down-button")) {
      // 모달창을 enabled 상태로 만들어줌
      shareModal.classList.toggle("enabled");

      // 아래쪽 실행 안 하고 함수 종료
      return;
    }
    // 모달창, 버튼 이외의 장소를 클릭한 경우 모달창 enabled 해제
    shareModal.classList.remove("enabled");
  }
  // 상위 요소가 모달일 경우(모달 클릭한 경우) 아무 것도 실행 안함(상태 유지)
});

/* 
  각 내역에 마우스 올린 경우 제목, 본문, 이미지 투명도 조정
*/

// 우선 모든 내역을 가져옴
const tradedItems = document.querySelectorAll(".trade-history-item-wrap");

// 각 내역에 mouseover, mouseout 이벤트 추가
tradedItems.forEach((item) => {
  // 각 내역의 이미지, 제목, 본문을 변수화
  const itemImage = item.children[1].children[0];
  const itemTitle = item.children[1].children[1];
  const itemArticle = item.children[1].children[2];

  item.addEventListener("mouseover", () => {
    itemImage.style.opacity = 0.6;
    itemTitle.style.opacity = 0.6;
    itemArticle.style.opacity = 0.6;
  });

  item.addEventListener("mouseout", () => {
    itemImage.style.opacity = 1;
    itemTitle.style.opacity = 1;
    itemArticle.style.opacity = 1;
  });
});

/*

  거래 내역의 유무에 따라 trade-history-wrap 안에서 표시할 내용 변경
  
  나중에 서버 들어갔을 때는
  거래 내역들(tradedItems)의 length가 1 이상이면 표시하게 변경할 계획

  임시로 true/false 변수로 바뀌게 설정함
*/

let isTradeExists = true; // 거래 내역 유무

// 거래 내역이 없을 때 보이는 텍스트들
const nothingTextBold = document.querySelector(".trade-history-wrap > h1");
const nothingText = document.querySelector(".trade-history-wrap > p");

// 각 거래 내역 사이의 구분선
const itemsSeperator = document.querySelectorAll(".items-seperator");

// 거래 내역이 있을 경우
if (isTradeExists) {
  // 거래 내역 없을 때 뜨는 텍스트들 안 보이게 함
  nothingTextBold.style.display = "none";
  nothingText.style.display = "none";

  // 각 거래내역 표시
  tradedItems.forEach((item) => {
    item.style.display = "block";
  });

  // 구분선 표시
  itemsSeperator.forEach((item) => {
    item.style.display = "block";
  });
}
// 거래 내역이 없을 경우
else {
  // 거래 내역 없을 때 뜨는 텍스트들을 보이게 함
  nothingTextBold.style.display = "block";
  nothingText.style.display = "block";

  // 각 거래내역 숨김
  tradedItems.forEach((item) => {
    item.style.display = "none";
  });

  // 구분선 숨김
  itemsSeperator.forEach((item) => {
    item.style.display = "none";
  });
}

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
