// 이미지 버튼 슬라이싱
const nextButton = document.querySelector(".scroller-ui-next");
const prevButton = document.querySelector(".scroller-ui-prev");
const target = document.querySelector(".scroller-contents-container");
const prevSvg = document.querySelector(".prev-icon");

const scrapCount = document.querySelector(".scrap-count");

const countUpdate = () => {
    scrapCountService.scrapCount(trade_id).then((count) => {
    scrapCount.innerText = count;
  });
}

var xdegree = 0;

if( user_trade_count / 3 > 1) {
  nextButton.addEventListener("click", (e) => {
    xdegree -= 712;
    with (target.style) {
      transform = `translateX(${xdegree}px)`;
      transition = "transform 0.3s ease 0s";
    }

    if (xdegree <= Math.floor(user_trade_count / 3) * -712) {
      nextButton.style.display = "none";
    }
    prevButton.style.display = "block";

    console.log(xdegree);
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

    console.log(xdegree);
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

const tradeSrcapBtnFn = (scrap) => {
  const img = scrap.querySelector(".scrap-img");
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

const tradeSrcapBtnBlkFn = (scrap) => {
  const img = scrap.querySelector(".scrap-img");
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
  tradeSrcapBtnFn(scrapBtn)
  const tradeContentId = scrapBtn.closest('.product-title-icon-wrap').classList[1]
  await tradeScrapService.update(tradeContentId)
  countUpdate();
})

const scrollerListContentsInner = document.querySelector('.scroller-list-contents-inner')
scrollerListContentsInner.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.img-scrap-button')
  tradeSrcapBtnBlkFn(scrapBtn)
  const tradeContentId = scrapBtn.closest('.product-suggestion-each-contents').classList[1]
  await tradeScrapService.update(tradeContentId)
})

// 퀵네비 클릭시 색변하도록
const navs = document.querySelectorAll(".product-detail-nav-item");
navs.forEach((nav, index) => {
  nav.addEventListener("click", (e) => {
    navs.forEach((otherNav, otherIndex) => {
      if (index !== otherIndex) {
        otherNav.classList.remove("active");
      }
    });
    nav.classList.add("active");
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

// 이미지 미리보기
const contentImg = document.querySelector(".product-cover-image");
const prevImgs = document.querySelectorAll(".product-small-image");
prevImgs.forEach((item) => {
  item.addEventListener("click", (e) => {
    const imgSrc = e.target.getAttribute("src");
    contentImg.setAttribute("src", imgSrc);
    contentImg.setAttribute("height", "558.33");
  });
});