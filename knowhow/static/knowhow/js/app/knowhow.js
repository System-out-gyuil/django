const a = document.querySelectorAll("a");
a.forEach((item) => {
  item.addEventListener("click", (e) => {});
});

let page = 1;
let isLoading = false;
async function getPosts() {
  const response = await fetch("");
  const posts = await response.json();
  return posts.reverse();
}

function appendItem(post) {
  const contentLineBox = document.querySelector(".content-line-box");
  const contentItem = document.createElement("a");
  contentItem.setAttribute("href", "#");
  contentItem.innerHTML = `
  <div class="content-item-wrap">
    <div class="content-item-container">
      <div class="content-img-box">
        <img
          src="../../../staticfiles/images/blank-image.png"
          class="content-img"
        />
        <div class="scrap-btn-box">
          <button
            type="button"
            class="scrap-btn"
          >
            <span class="scrap-icon-box">
              <img
                src="../../../staticfiles/images/scrap-off.png"
                alt=""
              />
            </span>
          </button>
        </div>
      </div>
      <p class="content-title">
        집에서 가장 바쁜 집순이의 다채로운 10평 투룸
      </p>
      <div class="content-uploader">
        <div class="uploader-img-box">
          <img
            src="../../../staticfiles/images/blank-image.png"
            class="uploader-img"
          />
        </div>
        <span class="uploader-name">다채롭솔</span>
      </div>
      <div class="content-data-box">
        <span class="content-data">
          스크랩
          <span>3</span>
        </span>
        <span class="content-data">
          조회
          <span>153</span>
        </span>
      </div>
    </div>
  </div>
  `;
  contentLineBox.appendChild(contentItem);
}
function showList() {
  const dummyArray = new Array(20).fill(0);
  dummyArray.forEach((post) => {
    appendItem(post);
  });
}
function handleScroll() {
  const scrollTop = document.documentElement.scrollTop;
  const windowHeight = window.innerHeight;
  const totalHeight = document.documentElement.scrollHeight;
  if (scrollTop + windowHeight >= totalHeight - 300) {
    showList();
  }
}

window.addEventListener("scroll", handleScroll);
showList();

// 스크랩 버튼
const contentLineBox = document.querySelector(".content-line-box");
const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");

let timeoutId;
let animationTarget;

contentLineBox.addEventListener("click", handleScrapButtonClick);

function handleScrapButtonClick(e) {
  const target = e.target.closest(".scrap-btn");
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

const modalWraps = document.querySelectorAll(".modal-wrap");
const filterBtns = document.querySelectorAll(".filter-btn");
modalWraps.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (!e.target.closest(".modal-container")) {
      item.classList.remove("modal-open");
    }
  });
});

let targetBtn;
filterBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    targetBtn = e.target;
    if (e.target.getAttribute("name") === "sort") {
      modalWraps[0].classList.add("modal-open");
    } else if (e.target.getAttribute("name") === "plant") {
      modalWraps[1].classList.add("modal-open");
    } else if (e.target.getAttribute("name") === "field") {
      modalWraps[2].classList.add("modal-open");
    }
    modalWraps.forEach((item) => {
      const modalContentBtns = item.querySelectorAll(".modal-content-btn");
      modalContentBtns.forEach((modalBtn) => {
        modalBtn.addEventListener("click", (e) => {
          const filterIcon = `<span class="filter-btn-icon"></span>`;
          const targetBtnText = e.target
            .closest("button")
            .querySelector(".modal-btn-text");
          targetBtn.innerHTML = targetBtnText.innerText + filterIcon;
          modalContentBtns.forEach((prev) => {
            prev.classList.remove("modal-btn-choice");
          });
          e.target.closest("button").classList.add("modal-btn-choice");
          modalWraps.forEach((modal) => {
            modal.classList.remove("modal-open");
          });
        });
      });
    });
  });
});
