// 이런 00 찾고 있나요에 이미지에 마우스 올렸을 때 확대되게 해야함 마우스 벗어나면 축소되게
const searchimg = document.querySelectorAll(".realmain-plantRecommend-photo");
const searchAtag = document.querySelectorAll(
  ".realmain-plantRecommend-profilelink"
);

searchAtag.forEach((atag, i) => {
  atag.addEventListener("mouseover", () => {
    searchimg[i].style.transform = "scale(1.05)";
  });
});

searchAtag.forEach((atag, i) => {
  atag.addEventListener("mouseout", () => {
    searchimg[i].style.transform = "scale(1)";
  });
});

// 원데이 클래스 부분에 사진 올리면 확대되고 내리면 축소되게 만들어야함
const searchOnedayImg = document.querySelectorAll(".realmain-my_lecture-photo");
const searchOnedayA = document.querySelectorAll(
  ".realmain-my_lecture-explanationA"
);

searchOnedayA.forEach((atag, i) => {
  atag.addEventListener("mouseover", () => {
    searchOnedayImg[i].style.transform = "scale(1.05)";
  });
});

searchOnedayA.forEach((atag, i) => {
  atag.addEventListener("mouseout", () => {
    searchOnedayImg[i].style.transform = "scale(1)";
  });
});


// 유저들의 강의 평가 부분 축소 확대 코드
const userReviewImg = document.querySelectorAll(".realmain-userReview-img");
const userReviewA = document.querySelectorAll(".realmain-userReview-contentA");

userReviewA.forEach((atag, i) => {
  atag.addEventListener("mouseover", () => {
    userReviewImg[i].style.transform = "scale(1.05)";
  });
});

userReviewA.forEach((atag, i) => {
  atag.addEventListener("mouseout", () => {
    userReviewImg[i].style.transform = "scale(1)";
  });
});

// 베스트 상품의 카테고리 버튼 구현
const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");
let timeoutId;
let animationTarget;


const transSrcapBtnFn = (scrap) => {
  if (scrap) {
    const img = scrap.querySelector(".scrap-img");
    const imgSrc = img.getAttribute("src");
    if (imgSrc === "/static/public/web/images/common/scrap-on.png") {
      img.setAttribute("src", "/static/public/web/images/common/scrap-off.png");
      if (animationTarget) {
        animationTarget.classList.remove("show-animation");
      }
      animationTarget = scrapCancel;
    } else {
      img.setAttribute("src", "/static/public/web/images/common/scrap-on.png");
      if (animationTarget) {
        animationTarget.classList.remove("show-animation");
      }
      animationTarget = scrapPopup;
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

}

const realmainPlantRecommendPhotoul = document.querySelector('.realmain-plantRecommend-photoul')
if (realmainPlantRecommendPhotoul) {
  realmainPlantRecommendPhotoul.addEventListener('click', async (e) => {
    const scrapBtn = e.target.closest('.scrap-button')
    transSrcapBtnFn(scrapBtn)
    const knowhowContentId = scrapBtn.closest('.realmain-plantRecommend-photoli').classList[1]
    await knowhowScrapService.update(knowhowContentId)
  })
}

const realmainLecturePhotoWrap = document.querySelector('.realmain-bestproduct-realphotoWrap')
if (realmainLecturePhotoWrap) {
  realmainLecturePhotoWrap.addEventListener('click', async (e) => {
    const scrapBtn = e.target.closest('.scrap-button')
    transSrcapBtnFn(scrapBtn)
    const lectureContentId = scrapBtn.closest('.realmain-bestproduct-realphotoContent').classList[1]
    await lectureScrapService.update(lectureContentId)
  })
}


const realmainTodayHotdealPhotoWrapUl = document.querySelector('.realmain-todayHotdeal-photoWrapUl')
if (realmainTodayHotdealPhotoWrapUl) {
  realmainTodayHotdealPhotoWrapUl.addEventListener('click', async (e) => {
    const scrapBtn = e.target.closest('.scrap-button')
    transSrcapBtnFn(scrapBtn)
    const tradeContentId = scrapBtn.closest('.realmain-todayHotdeal-photoWrapli').classList[1]
    await tradeScrapService.update(tradeContentId)
  })
}

const popularcontentPhotoDiv = document.querySelector('.popularcontent-photoDiv')
if (popularcontentPhotoDiv) {
  popularcontentPhotoDiv.addEventListener('click', async (e) => {
    const scrapBtn = e.target.closest('.scrap-button')
    transSrcapBtnFn(scrapBtn)
    const postContentId = scrapBtn.closest('.popularcontent-photoEachdiv').classList[2]
    await postScrapService.update(postContentId)
  })
}

