const inputWrap = document.querySelector(".input-wrap");
const inputContainer = document.querySelector(".input-container");
const commentInput = document.querySelector(".comment-input");

commentInput.addEventListener("focus", () => {
  inputContainer.style.border = "1px solid rgb(53, 197, 240)";
});
commentInput.addEventListener("focusout", () => {
  inputContainer.style.border = "1px solid rgb(218, 221, 224)";
});

const commentSubmitBtn = document.querySelector(".comment-submit-btn");
commentInput.addEventListener("keyup", () => {
  commentInput.value
    ? (commentSubmitBtn.style.color = "rgb(53, 197, 240)")
    : (commentSubmitBtn.style.color = "rgb(194, 200, 204)");
});

const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");

let timeoutId;
let animationTarget;

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

const stickyBtns = document.querySelectorAll(".sticky-btn");
stickyBtns.forEach((item) => {
  item.addEventListener("click", () => {
    if (item.getAttribute("title") === "좋아요") {
      const img = item.querySelector("img");
      const imgSrc = img.getAttribute("src");
      imgSrc === "../../../staticfiles/images/like-off.png"
        ? img.setAttribute("src", "../../../staticfiles/images/like-on.png")
        : img.setAttribute("src", "../../../staticfiles/images/like-off.png");
    }
    if (item.getAttribute("title") === "스크랩") {
      const img = item.querySelector("img");
      const imgSrc = img.getAttribute("src");
      if (imgSrc === "../../../staticfiles/images/scrap-off-blk.png") {
        img.setAttribute("src", "../../../staticfiles/images/scrap-on.png");
        showPopup(scrapPopup);
      } else {
        img.setAttribute(
          "src",
          "../../../staticfiles/images/scrap-off-blk.png"
        );
        showPopup(scrapCancel);
      }
    }
  });
});

const paginationBtn = document.querySelectorAll(".pagination-btn");
const paginationBox = document.querySelector(".pagination-box");

paginationBox.addEventListener("click", (e) => {
  let pageBtn = e.target.closest(".pagination-btn");
  if (pageBtn) {
    paginationBtn.forEach((item) => {
      item.classList.contains("select") && item.classList.remove("select");
    });
    pageBtn.classList.add("select");
  }
});
