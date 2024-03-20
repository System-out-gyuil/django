// 스크랩 버튼
const contentNewLineBox = document.querySelector(".new-contents-wrap");

contentNewLineBox.addEventListener("click", handleScrapButtonClick);

function handleScrapButtonClick(e) {
  const target = e.target.closest(".scrap-button");
  if (!target) return; // 스크랩 버튼이 아닌 경우 무시

  const img = target.querySelector("img");
  const imgSrc = img.getAttribute("src");

  if (imgSrc === "/staticfiles/images/scrap-off.png") {
    img.setAttribute("src", "/staticfiles/images/scrap-on.png");
    showPopup(scrapPopup);
  } else {
    img.setAttribute("src", "/staticfiles/images/scrap-off.png");
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

// 스크랩 버튼
const contentLineBox = document.querySelector(".trade-contents-wrap");
const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");

let timeoutId;
let animationTarget;

contentLineBox.addEventListener("click", handleScrapButtonClick);

function handleScrapButtonClick(e) {
  const target = e.target.closest(".scrap-button");
  if (!target) return; // 스크랩 버튼이 아닌 경우 무시

  const img = target.querySelector("img");
  const imgSrc = img.getAttribute("src");

  if (imgSrc === "/staticfiles/images/scrap-off.png") {
    img.setAttribute("src", "/staticfiles/images/scrap-on.png");
    showPopup(scrapPopup);
  } else {
    img.setAttribute("src", "/staticfiles/images/scrap-off.png");
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
