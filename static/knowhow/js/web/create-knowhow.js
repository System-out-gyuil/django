autosize($("textarea"));


const dropBoxGuide = document.querySelector("#drop-box-guide");
const dropBoxRequired = document.querySelector("#drop-box-required");
const downArrowIcon = document.querySelectorAll(".down-arrow");
const dropBoxes = document.querySelectorAll(".expanded");
const titleInput = document.querySelector(".title-input");
const titleInputCount = document.querySelector(".count");
const contentTextArea = document.querySelector(".content-text-area");
const contentCount = document.querySelector(".content-count");
const textInputContainer = document.querySelector(
  ".content-text-input-container"
);

const markIconWrap = document.querySelector(".mark-icon-wrap");
function PlantValue() {
  const selectBox = document.querySelector(".form-control")
  const selectValue = selectBox.option[selectBox.selectedIndex].value
  console.log(selectValue)

}

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
const prevImgBox = document.querySelector(".prev-img-box");
const inputs = document.querySelectorAll("input[type=file]");

inputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    const targetInput = e.target;
    const file = targetInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const path = event.target.result;
      e.target.nextElementSibling.setAttribute("src", path);
      e.target.closest(".prev-img-box-item").style.display = "block";

      const label = e.target.closest(".upload-wrap").querySelector("label");
      let count = 5;
      inputs.forEach((item) => {
        if (item.value === "") {
          label.setAttribute("for", item.id);
          count--;
        }
      });

      if (count === 5) {
        e.target.closest(".upload-wrap").querySelector("label").style.display =
          "none";
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  });
});

function hideImageAndInput(prevBox, input) {
  prevBox.style.display = "none";
  input.style.display = "none";
}

const cancelBtns = document.querySelectorAll(".cancel-btn");
cancelBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const prevBox = e.target.closest(".prev-img-box-item");
    const input = prevBox.querySelector("input");
    hideImageAndInput(prevBox, input);
    const label = e.target.closest(".upload-wrap").querySelector("label");

    input.value = "";
    let count = 5;
    inputs.forEach((item) => {
      console.log(item.value);
      if (item.value == "") {
        label.setAttribute("for", item.id);
        count--;
      }
    });
    console.log(count);
    if (count != 5) {
      e.target.closest(".upload-wrap").querySelector("label").style.display =
        "flex";
    }
  });
});

//미리보기 이미지 스크롤 마우스로
let isMouseDown = false;
let startX, scrollLeft;

prevImgBox.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  prevImgBox.classList.add("active");

  startX = e.pageX - prevImgBox.offsetLeft;
  scrollLeft = prevImgBox.scrollLeft;
});

prevImgBox.addEventListener("mouseleave", () => {
  isMouseDown = false;
  prevImgBox.classList.remove("active");
});

prevImgBox.addEventListener("mouseup", () => {
  isMouseDown = false;
  prevImgBox.classList.remove("active");
});

prevImgBox.addEventListener("mousemove", (e) => {
  if (!isMouseDown) return;

  e.preventDefault();
  const x = e.pageX - prevImgBox.offsetLeft;
  const walk = (x - startX) * 1;
  prevImgBox.scrollLeft = scrollLeft - walk;
});

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

const urlInput = document.querySelectorAll(".url-input");

urlInput.forEach((item) => {
  item.addEventListener("focus", (e) => {
    e.target.style.boxShadow = "0 0 0 3px rgba(53,197,240,.3)";
  });
  item.addEventListener("blur", (e) => {
    e.target.style.boxShadow = "";
  });
});
const requiredInfoItemInner = document.querySelector(
  ".required-info-item-inner"
);
const guideText = document.querySelector(".guide-text");
const requiredInfoInner = document.querySelectorAll(".required-info-inner");



//
// const addRemoveBtns = document.querySelectorAll('.add-and-delete-btn')
//
//
// addRemoveBtns.forEach((btn, i) => {
//   console.log(btn)
//   btn.addEventListener('click', (e) => {
//     const boxTitle = btn.getAttribute('title')
//     const doubleItemBox = document.querySelectorAll(".double-item-box");
//     console.log(btn)
//     if (boxTitle === "추가") {
//       console.log('추가')
//       if (doubleItemBox.length >= 3) return;
//       appendItem();
//     }
//     if (boxTitle === "삭제") {
//       console.log('삭제')
//       doubleItemBox.forEach((item) => {
//         item.remove();
//       })
//     }
//   })
// })

function appendItem() {
  const insertItem = document.createElement("div");
  insertItem.classList.add("double-item-box");
  insertItem.innerHTML = `
  <div class="double-input-wrap">
    <div class="double-input-left-box">
      <input
        class="url-input"
        value=""
        placeholder="URL 주소를 입력해주세요."
        name="knowhow-recommend-url"
      />
    </div>
  </div>
  <div class="tag-double-input-box">
    <div class="tag-double-input-right-box">
      <input
        class="url-input"
        value=""
        placeholder="표시할 내용"
        name="knowhow-recommend-content"
      />
    </div>
    <div class="add-and-delete-box">
      <button
        type="button"
        title="삭제"
        class="add-and-delete-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="29"
          height="29"
          viewBox="-3 -11 29 29"
          class="icon"
        >
          <path
            d="M10.8 2.8H5.7c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h11.6c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-6.5z"
            stroke="#525B61"
            stroke-width="0.5"
          ></path>
        </svg>
      </button>
    </div>
  </div>
    `;

  const parentElement = guideText.parentNode;
  parentElement.insertBefore(insertItem, guideText);
}

const recommendedBox = requiredInfoInner[4];
recommendedBox.addEventListener("click", (e) => {
  const doubleItemBox = document.querySelectorAll(".double-item-box");
  // btnItem이 null임
  const btnItem = e.target.closest("button");
  const itemTitle = btnItem.getAttribute("title");
  if (itemTitle === "추가") {
    console.log('추가')
    if (doubleItemBox.length >= 3) return;
    appendItem();
  }
  if (itemTitle === "삭제") {
    console.log('삭제')
    e.target.closest(".double-item-box").remove();
  }
});
// const plantSelections = document.querySelectorAll(".plant-selection");
// plantSelections.forEach((plantSelection) => {
//   plantSelection.addEventListener("click", (e) => {
//     plantSelection.classList.toggle("select-on");
//   });
// });

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