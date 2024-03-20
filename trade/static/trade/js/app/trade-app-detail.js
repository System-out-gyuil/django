// 스크랩 버튼
const contentLineBox = document.querySelector(".post-scrap-button");

contentLineBox.addEventListener("click", ScrapButtonClick);

function ScrapButtonClick(e) {
  const target = e.target.closest(".post-scrap-button");
  if (!target) return; // 스크랩 버튼이 아닌 경우 무시

  const img = target.querySelector("img");
  const imgSrc = img.getAttribute("src");

  if (imgSrc === "/staticfiles/images/scrap-off.png") {
    img.setAttribute("src", "/staticfiles/images/scrap-on.png");
  } else {
    img.setAttribute("src", "/staticfiles/images/scrap-off.png");
  }
}

const contentNewLineBox = document.querySelector(".scrap-button");

contentNewLineBox.addEventListener("click", handleScrapButtonClick);

function handleScrapButtonClick(e) {
  const target = e.target.closest(".scrap-button");
  if (!target) return; // 스크랩 버튼이 아닌 경우 무시

  const img = target.querySelector("img");
  const imgSrc = img.getAttribute("src");

  if (imgSrc === "/staticfiles/images/scrap-off.png") {
    img.setAttribute("src", "/staticfiles/images/scrap-on.png");
  } else {
    img.setAttribute("src", "/staticfiles/images/scrap-off.png");
  }
}
