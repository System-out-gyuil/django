// 회사소개 밑에 있는 무한 슬라이더 구현코드
function infinite() {
  const imgSlide = document.querySelector(".main-secondcontanier-imgwraplist");
  // 복제
  const clone = imgSlide.cloneNode(true);

  // 복제본 추가
  document.querySelector(".main-secondcontanier-imgwrap").appendChild(clone);

  // 원본, 복제본 위치 지정
  document.querySelector(".main-secondcontanier-imgwraplist").offsetWidth +
    "px";

  // 클래스 할당
  imgSlide.classList.add("original");
  clone.classList.add("clone");
}

infinite();

const origin1 = document.querySelector(
  ".main-secondcontanier-imgwraplist.original"
);
const clone1 = document.querySelector(
  ".main-secondcontanier-imgwraplist.clone"
);

const ocdiv = document.querySelector(".main-secondcontanier");
const infiniteDiv = document.querySelector(".main-secondcontanier-wrap");

infiniteDiv.addEventListener("mouseenter", () => {
  origin1.style.animationPlayState = "paused";
  clone1.style.animationPlayState = "paused";
});

infiniteDiv.addEventListener("mouseleave", () => {
  origin1.style.animation =
    "50s linear 0s infinite normal forwards running slide01";
  clone1.style.animation = "50s linear 0s infinite normal none running slide02";
});
