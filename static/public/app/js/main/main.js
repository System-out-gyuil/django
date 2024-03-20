// 모바일 스크랩 버튼 on off
const contentLineBox = document.querySelector(".main-body-wrap");
const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");

let timeoutId;
let animationTarget;

contentLineBox.addEventListener("click", handleScrapButtonClick);

function handleScrapButtonClick(e) {
  const target1 = e.target.closest(".main-body-onedayPhotoScrapbtn");
  const target2 = e.target.closest(".main-body-flowerScrapBtn");
  const target3 = e.target.closest(".main-body-todayHotdeal-scrapBtn");
  const target4 = e.target.closest(".main-body-bestProduct-ScrapBtn");
  let target = undefined;

  target1
    ? (target = target1)
    : target2
    ? (target = target2)
    : target3
    ? (target = target3)
    : target4
    ? (target = target4)
    : undefined;
  if (!target) return; // 스크랩 버튼이 아닌 경우 무시

  const img = target.querySelector("img");
  const imgSrc = img.getAttribute("src");

  if (imgSrc === "../../../staticfiles/images/scrap-off.png") {
    img.setAttribute("src", "../../../staticfiles/images/scrap-on.png");
    showPopup(scrapPopup);
  } else {
    img.setAttribute("src", "../../../staticfiles/images/scrap-off.png");
    showPopup(scrapCancel);
  }
}

// 팝업 보여주기
function showPopup(target) {
  clearTimeout(timeoutId);
  if (animationTarget) animationTarget.classList.remove("show-animation");
  animationTarget = target;
  animationTarget.classList.remove("hide-animation");
  animationTarget.classList.add("show-animation");

  // 일정 시간 후 팝업 숨기기
  timeoutId = setTimeout(() => {
    hidePopup();
  }, 3000);
}

// 팝업 숨기기
function hidePopup() {
  if (!animationTarget) return;
  animationTarget.classList.remove("show-animation");
  animationTarget.classList.add("hide-animation");
}

// 베스트 상품의 카테고리 버튼 구현
const categoryButtons = document.querySelectorAll("#btn");
categoryButtons[0].parentNode.classList.add("active");

categoryButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    // 두번째 버튼을 클릭한 순간 반복문을 돌리면서 버튼들에 active 클래스가 있으면 지워줘야함
    categoryButtons.forEach((btn) => {
      btn.parentNode.classList.remove("active");
    });
    btn.parentNode.classList.add("active");
  });
});
