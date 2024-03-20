let page = 1;
let isLoading = false;
async function getPosts() {
  const response = await fetch("");
  const posts = await response.json();
  return posts.reverse();
}

function appendItem(post) {
  const similarPosts = document.querySelector(".similar-posts");
  const contentItem = document.createElement("div");
  contentItem.classList.add("similar-post-box");
  contentItem.innerHTML = `
    <span>
      <div class="similar-post">
        <a href="#" class="similar-post-link">
          <img
            src="../../../staticfiles/images/blank-image.png"
            class="similar-post-img"
        /></a>
      </div>
    </span>
  `;
  similarPosts.appendChild(contentItem);
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

const inputWrap = document.querySelector(".input-wrap");
const inputContainer = document.querySelector(".input-container");
const commentInput = document.querySelector(".comment-input");

commentInput.addEventListener("focus", () => {
  inputContainer.style.border = "1px solid #c06888";
});
commentInput.addEventListener("focusout", () => {
  inputContainer.style.border = "1px solid rgb(218, 221, 224)";
});

const commentSubmitBtn = document.querySelector(".comment-submit-btn");
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
      imgSrc === "../../../staticfiles/images/like-off.png"
        ? img.setAttribute("src", "../../../staticfiles/images/like-on.png")
        : img.setAttribute("src", "../../../staticfiles/images/like-off.png");
    }
    if (item.getAttribute("title") === "저장") {
      const img = item.querySelector("img");
      const imgSrc = img.getAttribute("src");
      imgSrc === "../../../staticfiles/images/scrap-off-blk.png"
        ? img.setAttribute("src", "../../../staticfiles/images/scrap-on-pink.png")
        : img.setAttribute(
            "src",
            "../../../staticfiles/images/scrap-off-blk.png"
          );
    }
  });
});
stickyBtns.forEach((item) => {
  item.addEventListener("click", () => {});
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
