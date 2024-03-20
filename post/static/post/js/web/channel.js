const categoryAnkerItem = document.querySelectorAll(".nav-link");
const categoryTextItem = document.querySelectorAll(".link-text");
const nav = document.querySelector(".sticky-category-nav");

nav.addEventListener("click", (e) => {
  categoryAnkerItem.forEach((atag) => {
    atag.classList.contains("link-choice") &&
      atag.classList.remove("link-choice");
  });
  categoryTextItem.forEach((ptag) => {
    ptag.classList.contains("text-choice") &&
      ptag.classList.remove("text-choice");
  });

  let itemWrap = e.target.closest(".nav-link");
  if (itemWrap) {
    const childPtag = itemWrap.querySelector(".link-text");
    itemWrap.classList.add("link-choice");
    childPtag.classList.add("text-choice");
  }
});