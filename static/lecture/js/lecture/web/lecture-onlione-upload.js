// diy 키트 가감
const addButton = document.querySelector(".add-button");
const addTarget = document.querySelector(".add-diy-kit");
const cancelButton = document.querySelector(".cancel-button");
addButton.addEventListener("click", (e) => {
  addButton && (addTarget.style.display = "block");
});

cancelButton.addEventListener("click", (e) => {
  addTarget.style.display = "none";
});
