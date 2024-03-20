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

// 이런 00 찾고 있나요? 부분에 슬라이드 바 구현
const nextButton = document.querySelector(".realmain-nextbutton");
const beforeButton = document.querySelector(".realmain-beforebutton");
const beforeButtonDiv = document.querySelector(
  ".realmain-plantRecommend-beforebuttonWrap"
);
const nextButtonUl = document.querySelector(".realmain-plantRecommend-photoul");

nextButton.addEventListener("click", () => {
  nextButtonUl.style.transition = `transform 0.5s`;
  nextButtonUl.style.transform = `translateX(-963.34px)`;
  nextButton.style.display = "none";
  beforeButtonDiv.style.display = "block";
});

beforeButton.addEventListener("click", () => {
  nextButtonUl.style.transition = `transform 0.5s`;
  nextButtonUl.style.transform = `translateX(0px)`;
  nextButton.style.display = "flex";
  beforeButtonDiv.style.display = "none";
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

// 오늘의 딜 부분 슬라이더바 구현
const todayHotdealnextButton = document.querySelector(
  ".realmain-todayHotdeal-nextbutton"
);
const todayHotdealbeforeButton = document.querySelector(
  ".realmain-todayHotdeal-beforbutton"
);

const todayHotdealnextButtonUl = document.querySelector(
  ".realmain-todayHotdeal-photoWrapUl"
);

todayHotdealnextButton.addEventListener("click", () => {
  todayHotdealnextButtonUl.style.transition = `transform 0.5s`;
  todayHotdealnextButtonUl.style.transform = `translateX(-867px)`;
  todayHotdealnextButton.style.display = "none";
  todayHotdealbeforeButton.style.display = "flex";
});

todayHotdealbeforeButton.addEventListener("click", () => {
  todayHotdealnextButtonUl.style.transition = `transform 0.5s`;
  todayHotdealnextButtonUl.style.transform = `translateX(0px)`;
  todayHotdealnextButton.style.display = "flex";
  todayHotdealbeforeButton.style.display = "none";
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


const recommendScrapButton = document.querySelectorAll(
  ".realmain-plantRecommend-scrapbutton"
);

const transSrcapBtnFn = (scrapBtn, respones) => {
  if (respones) {
    const img = scrapBtn.querySelector(".scrap-img");
    if (respones.status) {
      img.setAttribute("src", "/static/public/web/images/common/scrap-on.png");
      if (animationTarget) {
        animationTarget.classList.remove("show-animation");
      }
      animationTarget = scrapPopup;
    } else {
      console.log(111)
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
}

const realmainPlantRecommendPhotoul = document.querySelector('.realmain-plantRecommend-photoul')
let timeoutId;
let animationTarget;

realmainPlantRecommendPhotoul.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  const knowhowContentId = scrapBtn.closest('.realmain-plantRecommend-photoli').classList[1]
  const respones = await knowhowScrapService.update(knowhowContentId)
  transSrcapBtnFn(scrapBtn, respones)
})

const realmainLecturePhotoWrap = document.querySelector('.realmain-lecture-photoWrap')
realmainLecturePhotoWrap.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  const lectureContentId = scrapBtn.closest('.realmain-lecture-photoEachdiv').classList[1]
  const respones = await lectureScrapService.update(lectureContentId)
  transSrcapBtnFn(scrapBtn, respones)
})

const realmainBestproductRealphotoWrap = document.querySelector('.realmain-bestproduct-realphotoWrap')
realmainBestproductRealphotoWrap.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  const lectureContentId = scrapBtn.closest('.realmain-bestproduct-realphotoContent').classList[1]
  const respones = await lectureScrapService.update(lectureContentId)
  transSrcapBtnFn(scrapBtn, respones)
})

const realmainTodayHotdealPhotoWrapUl = document.querySelector('.realmain-todayHotdeal-photoWrapUl')
realmainTodayHotdealPhotoWrapUl.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  const tradeContentId = scrapBtn.closest('.realmain-todayHotdeal-photoWrapli').classList[1]
  const respones = await tradeScrapService.update(tradeContentId)
  transSrcapBtnFn(scrapBtn, respones)
})

const popularcontentPhotoDiv = document.querySelector('.popularcontent-photoDiv')
popularcontentPhotoDiv.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  const postContentId = scrapBtn.closest('.popularcontent-photoEachdiv').classList[2]
  const respones = await postScrapService.update(postContentId)
  transSrcapBtnFn(scrapBtn, respones)
})

const realmainBestproductPhotoCategoryUl = document.querySelector('.realmain-bestproduct-photoCategoryUl')
const createTag = (tags) => {
  let tagsHTML = ``
  tags.forEach((tag) => {
    tagsHTML += `<span class="realmain-bestproduct-tagSpan"># ${tag}</span>`
  })
  return tagsHTML
}

const createBestLecture = (bestLectures) => {
  let bestLectureHTML = ``
  if (!bestLectures) return
  bestLectures.forEach((bestLecture, index) => {
    bestLectureHTML += `
  <div class="realmain-bestproduct-realphotoContent ${bestLecture.id}">
    <article class="realmain-bestproduct-realphotoArticle">
      <a class="realmain-bestproduct-realphotoA"></a>
      <div class="realmain-bestproduct-realphotoDiv">
        <img
            class="realmain-bestproduct-realphotoimg"
            src="/upload/${bestLecture.lecture_file_url}"
            width="365.33px"
            height="365.33px"
        />
        <button class="scrap-button" style="top:1px">
          <img
              src="${bestLecture.lecture_scrap ? '/static/public/web/images/common/scrap-on.png' : '/static/public/web/images/common/scrap-off.png'}"
              class="scrap-img"
              width="24px"
              height="24px"
          />
        </button>
        <div class="realmain-bestproduct-realphotosld"></div>
      </div>
      <div class="realmain-bestproduct-realphotoContentWrap">
        <h1 class="realmain-bestproduct-contenth">
          <span class="realmain-bestproduct-contenthead-brand">${bestLecture.lecture_title}</span>
          <span class="realmain-bestproduct-contenthead-name">${bestLecture.lecture_content}</span>
        </h1>
        <span class="realmain-bestproduct-contentbodySpan">
          <span class="realmain-bestproduct-price">${bestLecture.lecture_price}</span>
        </span>
        <p class="realmain-bestproduct-infoP">
          <svg
              class="bestporductStaricon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              preserveAspectRatio="xMidYMid meet"
          >
            <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M12 19.72l-5.677 2.405c-.76.322-1.318-.094-1.247-.906l.533-6.142-4.042-4.656c-.54-.624-.317-1.283.477-1.467l6.006-1.39L11.23 2.28c.426-.707 1.122-.699 1.542 0l3.179 5.282 6.006 1.391c.805.187 1.011.851.477 1.467l-4.042 4.656.533 6.142c.072.822-.497 1.224-1.247.906L12 19.72z"
            ></path>
          </svg>
          <strong class="realmain-bestproduct-strong">${bestLecture.lecture_rating}</strong>
          리뷰 ${bestLecture.review_count}
        </p>
        <span class="realmain-bestproduct-salepriceSpan">${createTag(bestLecture.lecture_tags)}</span>
      </div>
    </article>
    <div class="realmain-bestproduct-rankdiv">
      <svg width="26" height="30" fill="none">
        <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="m13 24.25-13 5V0h26v29.25l-13-5Z"
            fill="#134F2C"
        ></path>
      </svg>
      <span class="realmain-bestproduct-rank">${index + 1}</span>
    </div>
  </div>
  `
  })

  realmainBestproductRealphotoWrap.innerHTML = bestLectureHTML
}
const bestLecturecategoryHandler = async (e) => {
  const checkboxLabels = document.querySelectorAll('.realmain-bestproduct-photoCategoryNlC')
  let category = e ? e.target : null
  let bestLectures;
  if (!category) {
    bestLectures = await lectureCategoryService.list('전체')
  } else if (e.target.closest('.realmain-bestproduct-photoCategoryNlC')) {
    if (category.innerText === '전체' || category.innerText === '관엽식물' || category.innerText === '침엽식물' || category.innerText === '희귀식물' || category.innerText === '다육/선인장' || category.innerText === '테라리움' || category.innerText === '기타') {
      bestLectures = await lectureCategoryService.list(category.innerText)
      checkboxLabels.forEach((checkbox) => {
        checkbox.classList.remove('active')
      })
      e.target.closest('.realmain-bestproduct-photoCategoryNlC').classList.add('active')
    }
  }
  createBestLecture(bestLectures)
}
bestLecturecategoryHandler()
realmainBestproductPhotoCategoryUl.addEventListener("click", bestLecturecategoryHandler);


