autosize($("textarea"));

const dropBoxGuide = document.querySelector("#drop-box-guide");
const dropBoxRequired = document.querySelector("#drop-box-required");
const downArrowIcon = document.querySelectorAll(".down-arrow");
const dropBoxes = document.querySelectorAll(".expanded");
const titleInput = document.querySelector(".title-input");
const titleInputCount = document.querySelector(".count");
const contentCount = document.querySelector(".content-count");
const contentTextArea = document.querySelector(".content-text-area");
const textInputContainer = document.querySelector(
  ".content-text-input-container"
);

const markIconWrap = document.querySelector(".mark-icon-wrap");

dropBoxGuide.addEventListener("click", () => {
  downArrowIcon[0].classList.toggle("down-arrow-open");
  dropBoxes[0].classList.toggle("guide-open");
});

dropBoxRequired.addEventListener("click", () => {
  downArrowIcon[1].classList.toggle("down-arrow-open");
  dropBoxes[1].classList.toggle("required-open");
});

titleInput.addEventListener("keyup", (e) => {
  titleInputCount.innerText = 0;
  e.target.value && (titleInputCount.innerText = e.target.value.length);
});

textInputContainer.addEventListener("click", () => {
  contentTextArea.focus();
});

contentTextArea.addEventListener("click", () => {
  markIconWrap.classList.add("wrap-open");
});

const imgFileInput = document.querySelector("#img-file");
const prevImgBox = document.querySelector(".prev-img-box");
const cancel = document.querySelector(".cancel");
imgFileInput.addEventListener("change", (e) => {
  const [file] = e.target.files;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.addEventListener("load", (e) => {
    const path = e.target.result;
    cancel.style.display = "block";
    path.includes("image")
      ? ((prevImgBox.style.backgroundImage = `url(${path})`),
        (prevImgBox.style.zIndex = "5"))
      : (prevImgBox.style.backgroundImage = `url('images/attach.png')`);
  });
});
cancel.addEventListener("click", (e) => {
  prevImgBox.style.backgroundImage = "";
  prevImgBox.style.zIndex = "-5";
  e.target.style.display = "none";
  imgFileInput.value = "";
});

const tag = document.querySelector(".tag");
const tagInput = document.querySelector(".tag-input");
const tagList = document.querySelector(".tag-list");
const emptyValue = document.querySelector(".empty-value");
tagInput.addEventListener("keyup", (e) => {
  let value = e.target.value;
  if (e.keyCode === 13 && e.target.value) {
    const items = tagList.querySelectorAll(".tag-list > span");
    if (items.length + 1 <= 5) {
      e.target.value = "";
      const tagItem = document.createElement("span");
      tagItem.classList.add("tag");
      tagItem.innerHTML = `
      <span class="tag-left-line">#</span>
        <div class="tag-inner">
          <span class="tag-text">
            ${value}
          </span>
          <button type="button" class="tag-cancel-btn">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="#a2a9b4"
              viewBox="0 0 14 14"
              width="10px"
              height="10px"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
        `;
      tagList.appendChild(tagItem);
      const tags = document.querySelectorAll(".tag");
      tags.forEach((item) => {
        const canceltag = item.querySelector(".tag-cancel-btn");
        canceltag.addEventListener("click", () => {
          item.remove();
        });
      });
    }
  }
});
tagInput.addEventListener("focus", (e) => {
  e.target.style.boxShadow = "0 0 0 3px rgba(53,197,240,.3)";
});
tagInput.addEventListener("blur", (e) => {
  e.target.style.boxShadow = "";
});
const plantSelections = document.querySelectorAll(".plant-selection");
plantSelections.forEach((plantSelection) => {
  plantSelection.addEventListener("click", (e) => {
    plantSelection.classList.toggle("select-on");
  });
});

const checkboxes = document.querySelectorAll('input[type="checkbox"]');


checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    checkboxes.forEach((cb) => {
      const label = cb.closest('.plant-selection');
      if (cb.checked) {
        label.classList.add("select-on");
      } else {
        label.classList.remove("select-on");
      }
    });
  });
});

contentTextArea.addEventListener("keyup", () => {
  contentCount.innerText = contentTextArea.value.length
})