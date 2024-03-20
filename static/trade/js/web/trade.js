const priceFormat = (price) => {
    return new Intl.NumberFormat().format(price);
}


let page = 1;
const tradeSection = document.querySelector(".post-wrap");

const showList = (trades) => {
    let text = ``;

    trades.forEach((trade) => {
        let tagsHtml = '';

        trade.plant_name.forEach((pn) => {
            tagsHtml += `<span class="post-tag-icon">#${pn}</span>`;
        });

        text += `
            <div class="post-container ${trade.id}">
              <div class="post-inner">
                <article class="post">
                  <a href="/trade/detail/?id=${trade.id}" class="post-link"></a>
                  <div class="post-image-wrap_">
                    <div class="post-image-container">
                      <div class="post-image-inner">
                        <div class="post-image"></div>
                        <img
                          src="/upload/${trade.trade_file}"
                          alt
                          class="image"
                        />
                        <button class="scrap-button" type="button">
                          <img
                            src="${trade.trade_scrap ? '/static/public/web/images/common/scrap-on.png' : '/static/public/web/images/common/scrap-off.png'}"
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
                        <span class="post-contents-user">${trade.member_name}</span>
                        <span class="post-contents-banner">${trade.trade_title}</span>
                      </h1>
                      <span class="post-price">
                        <span class="post-price-letter">${priceFormat(trade.trade_price)}원</span>
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
tradeService.localList(page=1, showList).then((text) => {
            tradeSection.innerHTML += text;
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
        tradeService.localList(++page, showList).then((text) => {
            tradeSection.innerHTML += text;
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

const scrapButton = document.querySelector(".update-post-list");

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
  await tradeScrapService.update(tradeContentId)
})

// 팝업 보여주기
function showPopup(target) {
  clearTimeout(timeoutId);
  if (animationTarget) animationTarget.classList.remove("show-animation");
  animationTarget = target;
  animationTarget.classList.remove("hide-animation");
  animationTarget.classList.add("show-animation");

  // 일정 시간 후 팝업 숨기기
  timeoutId = setTimeout(() => {
    hidePopup();
  }, 3000);
}

// 팝업 숨기기
function hidePopup() {
  if (!animationTarget) return;
  animationTarget.classList.remove("show-animation");
  animationTarget.classList.add("hide-animation");
}

// 마우스 오버와 아웃 이벤트에 대한 함수를 만들어 재사용성을 높임
function handleMouseOverAndOut(event) {
  const target = event.target;
  if (!target) return; // 요소가 없으면 무시

  target.style.opacity = event.type === "mouseover" ? "30%" : "100%";
}

// popular-detail-link 요소에 이벤트 리스너 추가
const letter = document.querySelector(".popular-detail-link");
letter.addEventListener("mouseover", handleMouseOverAndOut);
letter.addEventListener("mouseout", handleMouseOverAndOut);

// new-detail-link 요소에 이벤트 리스너 추가
const newDetail = document.querySelector("#new-detail-link");
newDetail.addEventListener("mouseover", handleMouseOverAndOut);
newDetail.addEventListener("mouseout", handleMouseOverAndOut);

scrapBtn.addEventListener('click', async (e) => {
  const scrapButton = e.target.closest('.scrap-button')
  const tradeContentId = scrapButton.closest('.post-container').classList[1]
  await tradeScrapService.update(tradeContentId)
})

// 이미지에 마우스 대면 커지기
const images = document.querySelector(".image");

images.forEach((image, i) => {
  image.addEventListener("mouseover", (e) => {
    image[i].style.transform = "scale(1.05)";
  });
});


