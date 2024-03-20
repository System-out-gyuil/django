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

//스크랩 버튼
const scrapButton = document.querySelector(".update-post-list");

scrapButton.addEventListener("click", (e) => {
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

//더보기 글씨 흐려지기
const letter = document.querySelector(".popular-detail-link");

letter.addEventListener("mouseover", (e) => {
  e.target.style.opacity = "30%";
});

letter.addEventListener("mouseout", (e) => {
  e.target.style.opacity = "100%";
});

const newDetail = document.querySelector("#new-detail-link");
newDetail.addEventListener("mouseover", (e) => {
  e.target.style.opacity = "30%";
});

newDetail.addEventListener("mouseout", (e) => {
  e.target.style.opacity = "100%";
});

// 이미지에 마우스 대면 커지기
const images = document.querySelector(".image");

images.forEach((image, i) => {
  image.addEventListener("mouseover", (e) => {
    image[i].style.transform = "scale(1.05)";
  });
});
