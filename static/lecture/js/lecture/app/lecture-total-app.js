// 필터
const filterItems = document.querySelectorAll(".filter-item");
filterItems.forEach((item) => {
  const modal = item.querySelector(".filter-modal");
  item.addEventListener("mouseenter", () => {
    modal.classList.add("modal-open");
  });
  item.addEventListener("mouseleave", () => {
    modal.classList.remove("modal-open");
  });

  const modalMenuBtns = item.querySelectorAll(".modal-menu-btn");
  modalMenuBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      modalMenuBtns.forEach((btn) => {
        btn.classList.remove("choice");
      });
      const filterIcon = `<span class="filter-btn-icon"></span>`;
      e.target.closest(".filter-modal").previousElementSibling.innerHTML =
        btn.innerText + filterIcon;
      e.target.closest(".modal-menu-btn").classList.add("choice");
    });
  });
});

//스크랩 버튼
const scrapBtn = document.querySelector(".post-wrap");
const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");

let timeoutId;
let animationTarget;

scrapBtn.addEventListener("click", (e) => {
  const target = e.target.closest(".scrap-button");
  const img = target.querySelector("img");
  const imgSrc = img.getAttribute("src");
  if (imgSrc === "/staticfiles/images/scrap-off.png") {
    img.setAttribute("src", "/staticfiles/images/scrap-on.png");
    animationTarget && animationTarget.classList.remove("show-animation");
    animationTarget = scrapPopup;
  } else {
    img.setAttribute("src", "/staticfiles/images/scrap-off.png");
    animationTarget.classList.remove("show-animation");
    animationTarget = scrapCancel;
  }
  animationTarget.classList.remove("hide-animation");
  animationTarget.classList.add("show-animation");
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    animationTarget.classList.remove("show-animation");
    animationTarget.classList.add("hide-animation");
  }, 3000);
});
