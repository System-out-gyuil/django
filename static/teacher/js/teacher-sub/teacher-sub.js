const prevImgBox = document.querySelector(".prev-img-box");
const inputs = document.querySelectorAll(".lecture-input");

inputs.forEach((input, index) => {
    console.log(111)
  input.addEventListener("change", (e) => {
    const targetInput = e.target;
    const file = targetInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const path = event.target.result;
      // e.target.nextElementSibling.setAttribute("src", path);
       e.target.nextElementSibling.src = path;
      e.target.closest(".prev-img-box-item").style.display = "block";

      const label = e.target.closest(".upload-wrap").querySelector(".upload-btn");
      let count = 5;
      inputs.forEach((item) => {
        if (item.value === "") {
          label.setAttribute("for", item.id);
          count--;
        }
      });

      if (count === 5) {
        e.target.closest(".upload-wrap").querySelector(".upload-btn").style.display = "none";
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
    const input = prevBox.querySelector(".lecture-input");
    hideImageAndInput(prevBox, input);
    const label = e.target.closest(".upload-wrap").querySelector(".upload-btn");

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
      e.target.closest(".upload-wrap").querySelector(".upload-btn").style.display = "flex";
    }
  });
});

// 2
const prevImgBox2 = document.querySelector(".prev-img-box2");
const inputs2 = document.querySelectorAll(".exam-files");

inputs2.forEach((input, index) => {
  input.addEventListener("change", (e) => {
    const targetInput = e.target;
    const file = targetInput.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const path = event.target.result;
      e.target.nextElementSibling.setAttribute("src", path);
      e.target.closest(".prev-img-box-item2").style.display = "block";

      const label2 = e.target.closest(".upload-wrap2").querySelector(".upload-btn2");
      let count2 = 5;
      inputs2.forEach((item) => {
        if (item.value === "") {
          label2.setAttribute("for", item.id);
          count2--;
        }
      });

      if (count2 === 5) {
        e.target.closest(".upload-wrap2").querySelector(".upload-btn2").style.display = "none";
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  });
});

function hideImageAndInput2(prevBox2, input2) {
  prevBox2.style.display = "none";
  input2.style.display = "none";
}

const cancelBtns2 = document.querySelectorAll(".cancel-btn2");
cancelBtns2.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const prevBox2 = e.target.closest(".prev-img-box-item2");
    const input2 = prevBox2.querySelector(".exam-files");
    hideImageAndInput2(prevBox2, input2);
    const label2 = e.target.closest(".upload-wrap2").querySelector(".upload-btn2");

    input2.value = "";
    let count2 = 5;
    inputs2.forEach((item) => {
      console.log(item.value);
      if (item.value == "") {
        console.log(111);
        label2.setAttribute("for", item.id);
        count2--;
      }
    });
    console.log(count2);
    if (count2 != 5) {
      e.target.closest(".upload-wrap2").querySelector(".upload-btn2").style.display = "flex";
    }
  });
});

// const entryModal = document.querySelector(".entry-modal-wrap");
// const modalBtn = document.querySelectorAll(".header-entry-button, .entry-link");
//
// // 강사신청 모달창 표시
const entryModal = document.querySelector(".entry-modal-wrap");
const entryApplicationBtn = document.querySelector(".publish-btn");

entryApplicationBtn.addEventListener('click', ()=> {
    entryModal.style.display = "block";
});

// 강사신청 모달창 내 닫기 버튼
const closeBtn = document.querySelector(".close-button");

// 클릭하면 강사신청 모달창 닫힘
closeBtn.addEventListener("click", () => {
    entryModal.style.display = "none";
});


// 강사 신청 입력 안했을 때 신청하기 버튼 못 누르게 막기

// 약력
const teacherBriefHistory = document.querySelector(".record-input");
// 강의 설명
const lecturePlan = document.querySelector(".explanation-input");
// 강의 주소
const lecturePlace = document.querySelector(".lecture_place");

if (!teacherBriefHistory.value || !lecturePlan.value || !lecturePlace.value){
  entryApplicationBtn.disabled = true;
}
else{
  entryApplicationBtn.disabled = false;
}