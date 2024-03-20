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

