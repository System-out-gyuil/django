// 이미지 버튼 슬라이싱
const nextButton = document.querySelector(".scroller-ui-next");
const prevButton = document.querySelector(".scroller-ui-prev");
const target = document.querySelector(".scroller-contents-container");
const prevSvg = document.querySelector(".prev-icon");

const scrapCount = document.querySelector(".scrap-count");

const countUpdate = () => {
    scrapCountService.scrapCount(lecture_id).then((count) => {
    scrapCount.innerText = count;
  });
}

var xdegree = 0;


if( lecture_count / 3 > 1) {
  nextButton.addEventListener("click", (e) => {
    xdegree -= 712;
    with (target.style) {
      transform = `translateX(${xdegree}px)`;
      transition = "transform 0.3s ease 0s";
    }

    if (xdegree <= Math.floor(lecture_count / 3) * -712) {
      nextButton.style.display = "none";
    }
    prevButton.style.display = "block";

  });

  prevButton.addEventListener("click", (e) => {
    xdegree += 712;
    with (target.style) {
      transform = `translateX(${xdegree}px)`;
      transition = "transform 0.3s ease 0s";
    }

    if (xdegree >= 0) {
      prevButton.style.display = "none";
    }
    nextButton.style.display = "block";

  });
}
else{
  nextButton.style.display = "none";
}


//스크랩 버튼
const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");
let timeoutId;
let animationTarget;

const lectureSrcapBtnFn = (scrap) => {
  const img = scrap.querySelector("img");
  const imgSrc = img.getAttribute("src");
  if (imgSrc === "/static/public/web/images/common/scrap-off-blk.png") {
    img.setAttribute("src", "/static/public/web/images/common/scrap-on.png");
    if (animationTarget) {
      animationTarget.classList.remove("show-animation");
    }
    animationTarget = scrapPopup;
  } else {
    img.setAttribute("src", "/static/public/web/images/common/scrap-off-blk.png");
    if (animationTarget) {
      animationTarget.classList.remove("show-animation");
    }
    animationTarget = scrapCancel;
  }
  if (animationTarget) {
    animationTarget.classList.remove("hide-animation");
    animationTarget.classList.add("show-animation");
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      animationTarget.classList.remove("show-animation");
      animationTarget.classList.add("hide-animation");
    }, 3000);
  }
}

const lectureScrapBtnBlkFn = (scrap) => {
  const img = scrap.querySelector("img");
  const imgSrc = img.getAttribute("src");
  if (imgSrc === "/static/public/web/images/common/scrap-off.png") {
    img.setAttribute("src", "/static/public/web/images/common/scrap-on.png");
    if (animationTarget) {
      animationTarget.classList.remove("show-animation");
    }
    animationTarget = scrapPopup;
  } else {
    img.setAttribute("src", "/static/public/web/images/common/scrap-off.png");
    if (animationTarget) {
      animationTarget.classList.remove("show-animation");
    }
    animationTarget = scrapCancel;
  }
  if (animationTarget) {
    animationTarget.classList.remove("hide-animation");
    animationTarget.classList.add("show-animation");
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      animationTarget.classList.remove("show-animation");
      animationTarget.classList.add("hide-animation");
    }, 3000);
  }
}
countUpdate();
const productTitleIconWrap = document.querySelector('.product-title-icon-wrap')
productTitleIconWrap.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  lectureSrcapBtnFn(scrapBtn)
  const lectureContentId = scrapBtn.closest('.product-title-icon-wrap').classList[1]
  await lectureScrapService.update(lectureContentId)
  countUpdate();
})

const scrollerListContentsInner = document.querySelector('.scroller-list-contents-inner')
scrollerListContentsInner.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.img-scrap-button')
  lectureScrapBtnBlkFn(scrapBtn)
  const lectureContentId = scrapBtn.closest('.product-suggestion-each-contents').classList[1]
  await lectureScrapService.update(lectureContentId)
})


// 사이드 바 선택옵션 삭제
const deleteButtons = document.querySelectorAll(".sidebar-delete-button");
const deleteBtns = document.querySelectorAll(".delete-button-container");

deleteButtons.forEach((deleteButton) => {
  deleteButton.addEventListener("click", (e) => {
    const options = deleteButton.closest(".sidebar-selected-product-container");
    options.style.display = "none";
  });
});

// 물건 선택옵션 삭제

deleteBtns.forEach((deleteBtn) => {
  deleteBtn.addEventListener("click", (e) => {
    const selection = deleteBtn.closest(".selected-product-list-container");
    selection.style.display = "none";
    studentName.style.display = "none";
    sidebarSelected.style.display = "none";
    days.forEach((day) => {
      day.classList.remove("clicked");
    });
    times.forEach((time) => {
      timeSection.style.display = "none";
      time.classList.remove("clicked");
    });
    kits.forEach((kit) => {
      const target = document.querySelector(".product-option-second-wrap");
      target.style.display = "none";
      kit.classList.remove("clicked");
    });
  });
});

// =====================================================================================================================
// // 인원 가감
// const number = document.querySelector(".counted-number");
// const add = document.querySelector(".add-count");
// const sub = document.querySelector(".sub-count");
// const studentInfo = document.querySelector(".student-info-inner");
// const sidebarNumber = document.querySelector(".sidebar-count-number");
// const sidebarAdd = document.querySelector(".sidebar-add-count");
// const sidebarSub = document.querySelector(".sidebar-sub-count");
// const studentName = document.querySelector(".selected-student-list-wrap");
// const price = document.querySelector(".total-price");
// const sidebarPrice = document.querySelector(".sidebar-total-price");
// const studentAlert = document.querySelector(".student-count-title");
// const sidebarAlert = document.querySelector(".sidebar-student-count-title");
// const sidebarSelected = document.querySelector(
//   ".sidebar-selected-product-container"
// );
//
//
// var count = 0;
// var totalPrice = 0; // 추가된 총 가격
//
// // 총 가격을 업데이트하는 함수
// function updateTotalPrice() {
//   price.innerText = document.querySelector(".selected-price").innerText;
//   sidebarPrice.innerText = document.querySelector(".selected-price").innerText;
//   totalPrice = count * parseInt(price.innerText);
//   price.innerText = totalPrice + '원'; // 총 가격을 화면에 업데이트
//   sidebarPrice.innerText = totalPrice + '원'; // 총 가격을 화면에 업데이트
// }
//
// // add 클릭 이벤트 핸들러
// add.addEventListener("click", (e) => {
//   if (count < 5) {
//     count++;
//     updateTotalPrice(); // 수정된 부분: 총 가격 업데이트
//     count === 0
//       ? (studentName.style.display = "none")
//       : (studentName.style.display = "block");
//
//     // 예약자 정보 및 입력 칸 추가
//     const infoListWrap = document.createElement('div');
//     infoListWrap.classList.add('info-list-wrap');
//
//     const studentLabel = document.createElement('div');
//     studentLabel.classList.add('student-label');
//     studentLabel.innerHTML = `
//       <div>예약자</div> <div>${count}</div>
//     `;
//
//     const input = document.createElement('input');
//     input.classList.add('student-name-input');
//     input.placeholder = "예약자 이름을 입력하세요";
//     input.name = "price-input";
//
//     infoListWrap.appendChild(studentLabel);
//     infoListWrap.appendChild(input);
//     studentInfo.appendChild(infoListWrap);
//
//     number.innerHTML = `${count}`;
//     sidebarNumber.innerHTML = `${count}`;
//
//     if (count >= 5) {
//       studentAlert.innerHTML += `
//         <div class="student-alert">
//           <div>최대 예약인원은 ${count}명입니다.</div>
//         </div>`;
//       sidebarAlert.innerHTML += `
//         <div class="student-alert">
//           <div>최대 예약인원은 ${count}명입니다.</div>
//         </div>`;
//     }
//   }
// });
//
// sub.addEventListener("click", (e) => {
//   count == 0 ? (count = 0) : count--;
//   updateTotalPrice(); // 총 가격 업데이트
//   number.innerHTML = `${count}`;
//   sidebarNumber.innerHTML = `${count}`;
//   var target = studentInfo.querySelectorAll(".info-list-wrap");
//   target[count].remove();
//   var removeTarget = studentAlert.querySelector(".student-alert");
//   var sidebarTarget = sidebarAlert.querySelector(".student-alert");
//   removeTarget && removeTarget.remove();
//   sidebarTarget && sidebarTarget.remove();
// });
//
// sidebarAdd.addEventListener("click", (e) => {
//   if (count < 5) {
//     count++;
//     updateTotalPrice(); // 총 가격 업데이트
//     count === 0
//       ? (studentName.style.display = "none")
//       : (studentName.style.display = "block");
//     studentInfo.innerHTML += `
//     <div class="info-list-wrap">
//       <div class="student-label">
//         <div>예약자</div> <div>${count}</div>
//       </div>
//         <input
//           class="student-name-input"
//           placeholder="예약자 이름을 입력하세요"
//           name="price-input"
//         />
//     </div>`;
//     number.innerHTML = `${count}`;
//     sidebarNumber.innerHTML = `${count}`;
//     if (count >= 5) {
//       studentInfo.innerHTML += `
//       <div class="info-list-wrap">
//       <div class="student-alert">
//         <div>최대 예약인원은 ${count}명입니다.</div>
//       </div>
//     </div>`;
//     }
//   }
// });
//
// sidebarSub.addEventListener("click", (e) => {
//   count == 0 ? (count = 0) : count--;
//   updateTotalPrice(); // 총 가격 업데이트
//   number.innerHTML = `${count}`;
//   sidebarNumber.innerHTML = `${count}`;
//   var target = studentInfo.querySelectorAll(".info-list-wrap");
//   target[count].remove();
//   var studentAlert = studentInfo.querySelector(".student-alert");
//   studentAlert && studentAlert.remove();
// });


// 리뷰 리스트 다음 장
const lists = document.querySelectorAll(".product-review-page");
lists.forEach((list, index) => {
  list.addEventListener("click", (e) => {
    lists.forEach((otherList, otherIndex) => {
      if (index !== otherIndex) {
        otherList.classList.remove("selected-page");
      }
    });
    list.classList.add("selected-page");
  });
});


// 신고 모달
const declarationLabels = document.querySelectorAll(".declaration-label");
const declarationInputs = document.querySelectorAll(".declaration-input");
declarationLabels.forEach((item) => {
  item.addEventListener("click", () => {
    declarationInputs.forEach((radio, i) => {
      if (radio.checked) {
        radio.parentNode.classList.add("declaration-choice");
      } else {
        radio.parentNode.classList.remove("declaration-choice");
      }
    });
  });
});

// 신고 모달 띄우기
const declarationModalWrap = document.querySelector(".declaration-modal-wrap");
const contentDeclarationBtn = document.querySelector(".report-button");

if (contentDeclarationBtn) {
    contentDeclarationBtn.addEventListener("click", () => {
    declarationModalWrap.classList.add("open");
  });
}

// 신고 모달 없애기
const declarationBtns = document.querySelectorAll(".declaration-btn");
declarationBtns.forEach((declarationBtn)=>{
  declarationBtn.addEventListener("click", () => {
  declarationModalWrap.classList.remove("open");
});
})



