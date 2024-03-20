
const inputWrap = document.querySelector(".input-wrap");
const inputContainer = document.querySelector(".input-container");
const commentInput = document.querySelector(".comment-input");
const commentSubmitBtn = document.querySelector(".comment-submit-btn");

commentInput.addEventListener("focus", () => {
  inputContainer.style.border = "1px solid #c06888";
  console.log(commentInput.value)
  if (commentInput.value){
    commentSubmitBtn.disabled = false;
    commentSubmitBtn.style.cursor = 'pointer';
    commentSubmitBtn.style.color = "#c06888"
  }else {
    commentSubmitBtn.disabled = true;
    commentSubmitBtn.style.cursor = 'default';
    commentSubmitBtn.style.color = "rgb(194, 200, 204)";

  }

});
commentInput.addEventListener("focusout", () => {
  inputContainer.style.border = "1px solid rgb(218, 221, 224)";
});


commentInput.addEventListener("keyup", () => {
  console.log(commentInput.value)

  if(commentInput.value){
    commentSubmitBtn.disabled = false;
    commentSubmitBtn.style.cursor = 'pointer';
    commentSubmitBtn.style.color = "#c06888"
  }else {
    commentSubmitBtn.disabled = true;
    commentSubmitBtn.style.cursor = 'default';
    commentSubmitBtn.style.color = "rgb(194, 200, 204)";
  }

});

const stickyBtns = document.querySelectorAll(".sticky-btn");
stickyBtns.forEach((item) => {
  item.addEventListener("click", () => {

    if (item.getAttribute("title") === "좋아요") {
      const img = item.querySelector("img");
      const imgSrc = img.getAttribute("src");
      imgSrc === "/static/public/web/images/common/like-off.png"
        ? img.setAttribute("src", "/static/public/web/images/common/like-on.png")
        : img.setAttribute("src", "/static/public/web/images/common/like-off.png");
    }
    if (item.getAttribute("title") === "저장") {
      const img = item.querySelector("img");
      const imgSrc = img.getAttribute("src");
      imgSrc === "/static/public/web/images/common/scrap-off-blk.png"
        ? img.setAttribute(
            "src",
            "/static/public/web/images/common/scrap-on-pink.png"
          )
        : img.setAttribute(
            "src",
            "/static/public/web/images/common/scrap-off-blk.png"
          );
    }



  });
});

const paginationBtn = document.querySelectorAll(".pagination-btn");
const paginationBox = document.querySelector(".pagination-box");

paginationBox.addEventListener("click", (e) => {
  let pageBtn = e.target.closest(".pagination-btn");
  if (pageBtn) {
    paginationBtn.forEach((item) => {
      item.classList.contains("select") && item.classList.remove("select");
    });
    pageBtn.classList.add("select");
  }
});
//신고 모달
const declarationLabels = document.querySelectorAll(".declaration-label");
const declarationInputs = document.querySelectorAll(".declaration-input");
const declarationItems = document.querySelectorAll(".declaration-item")
declarationLabels.forEach((item, i) => {
  item.addEventListener("click", () => {
    declarationInputs.forEach((radio, j) => {

      declarationItems[j].classList.remove("report-choice")
      if (radio.checked) {
          radio.parentNode.classList.add("declaration-choice");
          declarationItems[j].classList.add("report-choice")

      } else {
        radio.parentNode.classList.remove("declaration-choice");
      }
    });
  });
});


//신고모달 띄우기
const declarationModalWrap = document.querySelector(".declaration-modal-wrap");
const contentDeclarationBtn = document.querySelector(
  ".content-declaration-btn"
);

if (member_Id !== knowhow_member_id){
  contentDeclarationBtn.addEventListener("click", () => {
    declarationModalWrap.classList.add("open");
  })

}
// 상단 신고하기 버튼 클릭 시


// 댓글 신고버튼
const commentDeclarationBtns = document.querySelectorAll(
  ".comment-declaration-btn"
);

// 댓글 신고버튼 클릭 시
// commentDeclarationBtns.forEach((item) => {
//   item.addEventListener("click", () => {
//     declarationModalWrap.classList.add("open");
//   });
// });

//신고 모달 없애기
const cancelDeclarationBtn = document.querySelector(".cancel-declaration-btn");
const reportDeclarationBtn = document.querySelector(".report-declaration-btn");
const reportInput = document.querySelector(".report-content")
// 취소하기 버튼 클릭 시
cancelDeclarationBtn.addEventListener("click", () => {
  declarationModalWrap.classList.remove("open");
});

// 신고하기 버튼 클릭 시
reportDeclarationBtn.addEventListener("click", (e) => {
  let reportContent = ''
  declarationItems.forEach((item) => {
    if(item.classList[1] === "report-choice"){
      // console.log(item.innerText)
      reportContent = item.innerText

      }
    })
  reportInput.value = reportContent
  declarationModalWrap.classList.remove("open");
});

//이미지 미리보기
const contentImg = document.querySelector(".content-img");
const prevImgs = document.querySelectorAll(".prev-img");
prevImgs.forEach((item) => {
  item.addEventListener("click", (e) => {
    const imgSrc = e.target.getAttribute("src");
    contentImg.setAttribute("src", imgSrc);
  });
});
