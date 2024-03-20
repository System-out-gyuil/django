const a = document.querySelector(".info-list-wrap");
const c = document.querySelector(".alert");
const b = document.querySelector(".product-index");

a.addEventListener("mouseover", (e) => {
  a.style.border = "2px solid black";
  a.style.borderRadius = "6px";
});
a.addEventListener("mouseout", (e) => {
  b.value == "unselected"
    ? (((a.style.border = "2px solid #c06888"), (a.style.borderRadius = "6px")),
      (c.style.display = "block"))
    : ((a.style.border = "1px solid #424242"), (c.style.display = "none"));
});

const guide = document.querySelector(".off");
const guideButton = document.querySelector(".guide-button");
const require = document.querySelector(".required-off");
const requiredButton = document.querySelector("#required-info-header");

guideButton.addEventListener("click", (e) => {
  guide.classList.toggle("expended");
});

requiredButton.addEventListener("click", (e) => {
  require.classList.toggle("expended");
});

const prevImgBox = document.querySelector(".prev-img-box");
const inputs = document.querySelectorAll("input[type=file]");

inputs.forEach((input, index) => {
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

// 1번 <--이건 안됨
// const plantSelections = document.querySelectorAll(".plant-selection");
// plantSelections.forEach((plantSelection) => {
//   plantSelection.addEventListener("click", (e) => {
//     plantSelection.classList.toggle("select-on");
//   });
// });

// 2번 얜 되는데 단일 선택만 됨
// const plantSelections = document.querySelectorAll(".plant-selection");
//
// plantSelections.forEach((plantSelection) => {
//   const radioButton = plantSelection.querySelector('input[type="checkbox"]');
//
//   plantSelection.addEventListener("click", (e) => {
//     radioButton.checked = true;
//     plantSelections.forEach((el) => {
//       el.classList.remove("select-on");
//     });
//     plantSelection.classList.add("select-on");
//   });
// });

// 3번
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

// 제목창 글자수 세는 코드
const titleInput = document.querySelector(".title-input");
const titleInputCount = document.querySelector(".count");
titleInput.addEventListener("keyup", (e) => {
  titleInputCount.innerText = 0;
  e.target.value && (titleInputCount.innerText = e.target.value.length);
});

//
const dropBoxGuide = document.querySelector("#guide-header");
const dropBoxRequired = document.querySelector("#required-info-header");
const downArrowIcon = document.querySelectorAll(".dropdown-icon");
const dropBoxes = document.querySelectorAll(".off");
// dropBoxes[0].style.display = "block";

dropBoxGuide.addEventListener("click", () => {
  downArrowIcon[0].classList.toggle("down-arrow-open");
  dropBoxes[0].classList.toggle("guide-open");
});

dropBoxRequired.addEventListener("click", () => {
  downArrowIcon[1].classList.toggle("down-arrow-open");
  dropBoxes[1].classList.toggle("required-open");
});
