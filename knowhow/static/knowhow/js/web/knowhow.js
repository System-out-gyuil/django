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
  if (imgSrc === "../../../staticfiles/images/scrap-off-pink.png") {
    img.setAttribute("src", "../../../staticfiles/images/scrap-on-pink.png");
    showPopup(scrapPopup);
  } else {
    img.setAttribute("src", "../../../staticfiles/images/scrap-off-pink.png");
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

const filterSelecters = document.querySelectorAll(".filter-selecter");
const optionCancelIcon = `<svg class="option-cancel-btn-icon" width="12" height="12" fill="currentColor" size="16" name="dismiss_thick">
<path d="M6 4.94 3.879 2.817l-1.061 1.06L4.939 6 2.818 8.121l1.06 1.061L6 7.061l2.121 2.121 1.061-1.06L7.061 6l2.121-2.121-1.06-1.061L6 4.939zM6 12A6 6 0 1 1 6 0a6 6 0 0 1 0 12z"></path>
</svg>`;
filterSelecters.forEach((item) => {
  const modal = item.querySelector(".filter-modal");
  if (!modal) return;
  item.addEventListener("mouseenter", () => {
    modal.classList.add("open");
  });
  item.addEventListener("mouseleave", () => {
    modal.classList.remove("open");
  });
});

const sortSelecter = document.querySelector(".sort-selecter");
sortSelecter.addEventListener("click", (e) => {
  const modalMenuBtns = sortSelecter.querySelectorAll(".modal-menu-btn");
  if (e.target.closest(".modal-menu-btn")) {
    modalMenuBtns.forEach((btn) => {
      btn.classList.remove("choice");
    });
    e.target.closest(".modal-menu-btn").classList.add("choice");
    const sortItem = document.querySelector(".sort-item");
    if (e.target.innerText == "최신순") {
      sortSelecter.querySelector(".filter-btn").classList.remove("choice");
      sortItem.remove();
    } else {
      sortSelecter.querySelector(".filter-btn").classList.add("choice");
      if (!sortItem) {
        const optionItem = document.createElement("span");
        optionItem.classList.add("option-item");
        optionItem.classList.add("sort-item");
        optionItem.innerHTML = `
          <button class="option-cancel-btn">
            ${e.target.innerText}
            ${optionCancelIcon}
          </button>
        `;
        const parentElement = optionResetBtn.parentNode;
        parentElement.insertBefore(optionItem, optionResetBtn);
      } else {
        sortItem.innerHTML = `
        <button class="option-cancel-btn">
          ${e.target.innerText}
          ${optionCancelIcon}
        </button>
      `;
      }
    }
  }
  childObserver();
});

const fieldSelecter = document.querySelector(".field-selecter");
fieldSelecter.addEventListener("click", (e) => {
  const modalMenuBtns = fieldSelecter.querySelectorAll(".modal-menu-btn");
  if (e.target.closest(".modal-menu-btn")) {
    modalMenuBtns.forEach((btn) => {
      btn.classList.remove("choice");
    });
    e.target.closest(".modal-menu-btn").classList.add("choice");
    fieldSelecter.querySelector(".filter-btn").classList.add("choice");
    const fieldItem = document.querySelector(".field-item");
    if (!fieldItem) {
      const optionItem = document.createElement("span");
      optionItem.classList.add("option-item");
      optionItem.classList.add("field-item");
      optionItem.innerHTML = `
        <button class="option-cancel-btn">
          ${e.target.innerText}
          ${optionCancelIcon}
        </button>
      `;
      const parentElement = optionResetBtn.parentNode;
      parentElement.insertBefore(optionItem, optionResetBtn);
    } else {
      fieldItem.innerHTML = `
      <button class="option-cancel-btn">
        ${e.target.innerText}
        ${optionCancelIcon}
      </button>
    `;
    }
  }
  childObserver();
});

const individuals = document.querySelectorAll(".individual");
individuals.forEach((individual) => {
  individual.addEventListener("click", (e) => {
    e.target.closest(".individual").classList.toggle("choice");
    if (individual.classList.contains("choice")) {
      const individualValue = individual.innerText;
      createOptionElement(individualValue);
    } else {
      const optionItems = document.querySelectorAll(".option-item");
      optionItems.forEach((item) => {
        if (item.innerText == e.target.innerText) {
          item.remove();
        }
      });
    }
    childObserver();
  });
});
const optionResetBtn = document.querySelector(".option-reset-btn");
function createOptionElement(optionValue) {
  const optionItem = document.createElement("span");
  optionItem.classList.add("option-item");
  optionItem.innerHTML = `
  <button class="option-cancel-btn">
    ${optionValue}
    ${optionCancelIcon}
  </button>
  `;
  const parentElement = optionResetBtn.parentNode;
  parentElement.insertBefore(optionItem, optionResetBtn);
}
const newOption = document.querySelector(".new-option");
function childObserver() {
  const optionItems = document.querySelectorAll(".option-item");
  if (optionItems.length <= 0) {
    optionResetBtn.style.display = "none";
  } else {
    optionResetBtn.style.display = "block";
  }

  optionItems.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetItem = e.target.closest(".option-item");
      options.forEach((option) => {
        if (option.innerText === targetItem.innerText) {
          option.classList.remove("choice");
        }
        if (e.target.closest(".field-item")) {
          let targetBtnBox = e.target
            .closest(".filter-wrap")
            .querySelector(".field-selecter");
          const options = targetBtnBox.querySelectorAll(".option");
          options.forEach((item) => {
            item.classList.remove("choice");
          });
        }
        if (e.target.closest(".sort-item")) {
          let targetBtnBox = e.target
            .closest(".filter-wrap")
            .querySelector(".sort-selecter");
          const options = targetBtnBox.querySelectorAll(".option");
          options.forEach((item) => {
            item.classList.remove("choice");
          });
          newOption.classList.add("choice");
        }
      });
      targetItem.remove();
      childObserver();
    });
  });
}
const options = document.querySelectorAll(".option");
optionResetBtn.addEventListener("click", () => {
  const optionItems = document.querySelectorAll(".option-item");
  optionItems.forEach((option) => {
    option.remove();
  });
  options.forEach((item) => {
    item.classList.remove("choice");
  });
  optionResetBtn.style.display = "none";
  newOption.classList.add("choice");
});
