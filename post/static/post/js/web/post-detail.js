// let page = 1;
let isLoading = false;

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

// async function getPosts() {
//   const response = await fetch("");
//   const posts = await response.json();
//   return posts.reverse();
// }
//
// function appendItem(post) {
//   const similarPosts = document.querySelector(".similar-posts");
//   const contentItem = document.createElement("div");
//   contentItem.classList.add("similar-post-box");
//   contentItem.innerHTML = `
//     <span>
//       <div class="similar-post">
//         <a href="#" class="similar-post-link">
//           <img
//             src="../../../staticfiles/images/blank-image.png"
//             class="similar-post-img"
//         /></a>
//       </div>
//     </span>
//   `;
//   similarPosts.appendChild(contentItem);
// }
// function showLists() {
//   const dummyArray = new Array(20).fill(0);
//   dummyArray.forEach((post) => {
//     appendItem(post);
//   });
// }
// function handleScroll() {
//   const scrollTop = document.documentElement.scrollTop;
//   const windowHeight = window.innerHeight;
//   const totalHeight = document.documentElement.scrollHeight;
//   if (scrollTop + windowHeight >= totalHeight - 300) {
//     showLists();
//   }
// }
//
// window.addEventListener("scroll", handleScroll);
// showLists();

// const inputWrap = document.querySelector(".input-wrap");
// const inputContainer = document.querySelector(".input-container");
// const commentInput = document.querySelector(".comment-input");

commentInput.addEventListener("focus", () => {
  inputContainer.style.border = "1px solid #c06888";
});
commentInput.addEventListener("focusout", () => {
  inputContainer.style.border = "1px solid rgb(218, 221, 224)";
});

// const commentSubmitBtn = document.querySelector(".comment-submit-btn");
commentInput.addEventListener("keyup", () => {
  commentInput.value
    ? (commentSubmitBtn.style.color = "#c06888")
    : (commentSubmitBtn.style.color = "rgb(194, 200, 204)");
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
// stickyBtns.forEach((item) => {
//   item.addEventListener("click", () => {});
// });
//
// const paginationBtn = document.querySelectorAll(".pagination-btn");
// const paginationBox = document.querySelector(".pagination-box");
//
// paginationBox.addEventListener("click", (e) => {
//   let pageBtn = e.target.closest(".pagination-btn");
//   if (pageBtn) {
//     paginationBtn.forEach((item) => {
//       item.classList.contains("select") && item.classList.remove("select");
//     });
//     pageBtn.classList.add("select");
//   }
// });

const commentLikeBtn = document.querySelectorAll(".comment-like-btn");
commentLikeBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn
      .querySelector(".comment-like-icon")
      .classList.toggle("comment-like-icon-choice");
  });
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

// 상단 신고하기 버튼 클릭 시
if(post_member_id !== member_id){
  contentDeclarationBtn.addEventListener("click", () => {
    declarationModalWrap.classList.add("open");
  });

}

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

