let page = 1;
const lectureSection = document.querySelector(".post-wrap");

const showList = (lectures) => {
    let text = ``;

    lectures.forEach((lecture) => {
        let tagsHtml = '';

        lecture.plant_name.forEach((pn) => {
            tagsHtml += `<span class="post-tag-icon">#${pn}</span>`;
        });

        text += `
            <div class="post-container ${lecture.id}">
              <div class="post-inner">
                <article class="post">
                  <a href="/lecture/detail/offline/?id=${lecture.id}" class="post-link"></a>
                  <div class="post-image-wrap_">
                    <div class="post-image-container">
                      <div class="post-image-inner">
                        <div class="post-image"></div>
                        <img
                          src="/upload/${lecture.lecture_file}"
                          alt
                          class="image"
                        />
                        <button class="scrap-button" type="button">
                          <img
                            src="${lecture.lecture_scrap ? '/static/public/web/images/common/scrap-on.png' : '/static/public/web/images/common/scrap-off.png'}"
                            alt
                            class="scrap-img"
                          />
                        </button>
                        <div class="image__dark-overlay"></div>
                      </div>
                    </div>
                  </div>
                  <div class="post-contents-wrap">
                    <div class="post-contents-container">
                      <h1 class="post-contents-header">
                        <span class="post-contents-user">${lecture.member_name}</span>
                        <span class="post-contents-banner">${lecture.lecture_title}</span>
                      </h1>
                      <span class="post-price">
                        <span class="post-price-letter">${lecture.lecture_price}원</span>
                      </span>
                      <span class="post-tag">
                        ${tagsHtml}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          `;
    });

    return text;
}

// 처음 토탈 페이지 들어갔을 때 뿌려줄 목록
lectureService.localList(page=1, showList).then((text) => {
            lectureSection.innerHTML += text;
});

// 스크롤 할때마다 실행
window.addEventListener("scroll", () => {
    // 맨위
    const scrollTop = document.documentElement.scrollTop;
    // 페이지 높이
    const windowHeight = window.innerHeight;
    // 암튼 높이
    const totalHeight = document.documentElement.scrollHeight;
    // 전체 높이에서 내가 보는 스크롤이 total보다 크면 추가

    if (scrollTop + windowHeight >= totalHeight) {
        lectureService.localList(++page, showList).then((text) => {
            lectureSection.innerHTML += text;
        });
    }
});



// 스크랩 버튼
const scrapBtn = document.querySelector(".post-wrap");
const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");

let timeoutId;
let animationTarget;

const tradeSrcapBtnFn = (scrap) => {
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

// const scrapButton = document.querySelector(".update-post-list");

// scrapButton.addEventListener("click", (e) => {
//   const target = e.target.closest(".scrap-button");
//   const img = target.querySelector("img");
//   const imgSrc = img.getAttribute("src");
//   if (imgSrc === "/static/public/web/images/common/scrap-off.png") {
//     img.setAttribute("src", "/static/public/web/images/common/scrap-on.png");
//     animationTarget && animationTarget.classList.remove("show-animation");
//     animationTarget = scrapPopup;
//   } else {
//     img.setAttribute("src", "/static/public/web/images/common/scrap-off.png");
//     animationTarget.classList.remove("show-animation");
//     animationTarget = scrapCancel;
//   }
//   animationTarget.classList.remove("hide-animation");
//   animationTarget.classList.add("show-animation");
//   clearTimeout(timeoutId);
//   timeoutId = setTimeout(() => {
//     animationTarget.classList.remove("show-animation");
//     animationTarget.classList.add("hide-animation");
//   }, 3000);
// });

const postWrap = document.querySelector('.post-wrap')
postWrap.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  tradeSrcapBtnFn(scrapBtn)
  console.log(scrapBtn.closest('.post-container').classList[1])
  const tradeContentId = scrapBtn.closest('.post-container').classList[1]
  await lectureScrapService.update(tradeContentId)
})



transactionMainPage.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  transScrapBtnFn(scrapBtn)
  const lectureContentId = scrapBtn.closest('.post-container').classList[1]
  console.log(lectureContentId)
  await lectureScrapService.update(lectureContentId)
})


// //더보기 글씨 흐려지기
// const letter = document.querySelector(".popular-detail-link");
//
// letter.addEventListener("mouseover", (e) => {
//   e.target.style.opacity = "30%";
// });
//
// letter.addEventListener("mouseout", (e) => {
//   e.target.style.opacity = "100%";
// });
//
// const newDetail = document.querySelector("#new-detail-link");
// newDetail.addEventListener("mouseover", (e) => {
//   e.target.style.opacity = "30%";
// });
//
// newDetail.addEventListener("mouseout", (e) => {
//   e.target.style.opacity = "100%";
// });

// 이미지에 마우스 대면 커지기
const images = document.querySelector(".image");

images.forEach((image, i) => {
  image.addEventListener("mouseover", (e) => {
    image[i].style.transform = "scale(1.05)";
  });
});
