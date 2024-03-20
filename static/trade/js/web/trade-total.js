const priceFormat = (price) => {
    return new Intl.NumberFormat().format(price);
}

//스크랩 버튼
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

const postWrap = document.querySelector('.post-wrap')
postWrap.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  tradeSrcapBtnFn(scrapBtn)
  console.log(scrapBtn.closest('.post-container').classList[1])
  const tradeContentId = scrapBtn.closest('.post-container').classList[1]
  await tradeScrapService.update(tradeContentId)
})

// 필터
const filterSelecters = document.querySelectorAll(".filter-selecter");
const optionCancelIcon = `<svg class="option-cancel-btn-icon" width="12" height="12" fill="currentColor" size="16" name="dismiss_thick">
<path d="M6 4.94 3.879 2.817l-1.061 1.06L4.939 6 2.818 8.121l1.06 1.061L6 7.061l2.121 2.121 1.061-1.06L7.061 6l2.121-2.121-1.06-1.061L6 4.939zM6 12A6 6 0 1 1 6 0a6 6 0 0 1 0 12z"></path>
</svg>`;
filterSelecters.forEach((item) => {
  const modal = item.querySelector(".filter-modal");
  if (!modal) return;
  item.addEventListener("mouseenter", () => {
    modal.classList.add("open");
  });
  item.addEventListener("mouseleave", () => {
    modal.classList.remove("open");
  });
});

const sortSelecter = document.querySelector(".sort-selecter");
sortSelecter.addEventListener("click", (e) => {
  const modalMenuBtns = sortSelecter.querySelectorAll(".modal-menu-btn");
  if (e.target.closest(".modal-menu-btn")) {
    modalMenuBtns.forEach((btn) => {
      btn.classList.remove("choice");
    });
    e.target.closest(".modal-menu-btn").classList.add("choice");
    const sortItem = document.querySelector(".sort-item");
    if (e.target.innerText == "최신순") {
      sortSelecter.querySelector(".filter-btn").classList.remove("choice");
      console.log(sortItem);
      sortItem.remove();
    } else {
      sortSelecter.querySelector(".filter-btn").classList.add("choice");
      if (!sortItem) {
        const optionItem = document.createElement("span");
        optionItem.classList.add("option-item");
        optionItem.classList.add("sort-item");
        optionItem.innerHTML = `
          <button class="option-cancel-btn">
            ${e.target.innerText}
            ${optionCancelIcon}
          </button>
        `;
        const parentElement = optionResetBtn.parentNode;
        parentElement.insertBefore(optionItem, optionResetBtn);
      } else {
        sortItem.innerHTML = `
        <button class="option-cancel-btn">
          ${e.target.innerText}
          ${optionCancelIcon}
        </button>
      `;
      }
    }
  }
  childObserver();
});

const areaSelecter = document.querySelector(".area-selecter");
areaSelecter.addEventListener("click", (e) => {
  const modalMenuBtns = areaSelecter.querySelectorAll(".modal-menu-btn");
  if (e.target.closest(".modal-menu-btn")) {
    modalMenuBtns.forEach((btn) => {
      btn.classList.remove("choice");
    });
    e.target.closest(".modal-menu-btn").classList.add("choice");
    areaSelecter.querySelector(".filter-btn").classList.add("choice");
    const areaItem = document.querySelector(".area-item");
    if (!areaItem) {
      const optionItem = document.createElement("span");
      optionItem.classList.add("option-item");
      optionItem.classList.add("area-item");
      optionItem.innerHTML = `
        <button class="option-cancel-btn">
          ${e.target.innerText}
          ${optionCancelIcon}
        </button>
      `;
      const parentElement = optionResetBtn.parentNode;
      parentElement.insertBefore(optionItem, optionResetBtn);
    } else {
      areaItem.innerHTML = `
      <button class="option-cancel-btn">
        ${e.target.innerText}
        ${optionCancelIcon}
      </button>
    `;
    }
  }
  childObserver();
});

const individuals = document.querySelectorAll(".individual");
individuals.forEach((individual) => {
  individual.addEventListener("click", (e) => {
    e.target.closest(".individual").classList.toggle("choice");
    if (individual.classList.contains("choice")) {
      const individualValue = individual.innerText;
      createOptionElement(individualValue);
    } else {
      const optionItems = document.querySelectorAll(".option-item");
      optionItems.forEach((item) => {
        if (item.innerText == e.target.innerText) {
          item.remove();
        }
      });
    }
    childObserver();
  });
});
const optionResetBtn = document.querySelector(".option-reset-btn");
function createOptionElement(optionValue) {
  const optionItem = document.createElement("span");
  optionItem.classList.add("option-item");
  optionItem.innerHTML = `
  <button class="option-cancel-btn">
    ${optionValue}
    ${optionCancelIcon}
  </button>
  `;
  const parentElement = optionResetBtn.parentNode;
  parentElement.insertBefore(optionItem, optionResetBtn);
}
const newOption = document.querySelector(".new-option");
function childObserver() {
  const optionItems = document.querySelectorAll(".option-item");
  if (optionItems.length <= 0) {
    optionResetBtn.style.display = "none";
  } else {
    optionResetBtn.style.display = "block";
  }

  optionItems.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetItem = e.target.closest(".option-item");
      options.forEach((option) => {
        if (option.innerText === targetItem.innerText) {
          option.classList.remove("choice");
        }
        if (e.target.closest(".area-item")) {
          let targetBtnBox = e.target
            .closest(".filter-wrap")
            .querySelector(".area-selecter");
          const options = targetBtnBox.querySelectorAll(".option");
          options.forEach((item) => {
            item.classList.remove("choice");
          });
        }
        if (e.target.closest(".sort-item")) {
          let targetBtnBox = e.target
            .closest(".filter-wrap")
            .querySelector(".sort-selecter");
          const options = targetBtnBox.querySelectorAll(".option");
          options.forEach((item) => {
            item.classList.remove("choice");
          });
          newOption.classList.add("choice");
        }
      });
      targetItem.remove();
      childObserver();
    });
  });
}

const options = document.querySelectorAll(".option");
optionResetBtn.addEventListener("click", () => {
  const optionItems = document.querySelectorAll(".option-item");
  optionItems.forEach((option) => {
    option.remove();
  });
  options.forEach((item) => {
    item.classList.remove("choice");
  });
  optionResetBtn.style.display = "none";
  newOption.classList.add("choice");
});

// 게시물 목록 보기
let page = 1;

const tradeSection = document.querySelector(".post-wrap");
// 정렬 분야 관엽식물 등등
const filterItems = document.querySelectorAll(".filter-item");
const optionList = document.querySelector('.option-list');
// 정렬 분야 관엽식물을 누르면 나오는 모달창 정확히는 최신순 인기순
const sortChoices = document.querySelectorAll(".menu-choice");
// 초기화 버튼
const optionReset = document.querySelector(".option-reset-btn")
let filter = `전체`;
let sorting = `최신순`
let type = '전체'

optionReset.addEventListener("click", async () => {
    filter = '전체'
    sorting = '최신순'
    type = '전체'
    await tradeService.getList(page=1, filter, sorting, type, showList).then((text) => {
            tradeSection.innerHTML = text;
        });
})

sortChoices.forEach((sort) => {
    sort.addEventListener("click", async () => {

        if (sort.innerText === "최신순") {
            sorting = '최신순';
            page = 1;
        }else if(sort.innerText === "스크랩순"){
            sorting = '스크랩순'
            page = 1;
        }else if(sort.innerText === "상품") {
            type = '상품'
        }else if(sort.innerText === "식물") {
            type = '식물'
        }else if(sort.innerText === "수공예품") {
            type = '수공예품'
        }else if(sort.innerText === "테라리움") {
            type = '테라리움'
        }else if(sort.innerText === "기타") {
            type = '기타'
        }

        await tradeService.getList(page=1, filter, sorting, type, showList).then((text) => {
            tradeSection.innerHTML = text;
        });
    })
})

filterItems.forEach((item) => {
    item.addEventListener('click', async (e) => {

        if(item.children[0].classList[3] === 'choice'){
            filter += `,${e.target.innerText}`

        }else {
            if(e.target.innerText === '관엽식물'){
                filter = filter.replace(',관엽식물', '')

            }else if(e.target.innerText === '침엽식물'){
                filter = filter.replace(',침엽식물', '')

            }else if(e.target.innerText === '희귀식물'){
                filter = filter.replace(',희귀식물', '')

            }else if(e.target.innerText === '다육'){
                filter = filter.replace(',다육', '')

            }else if(e.target.innerText === '선인장'){
                filter = filter.replace(',선인장', '')

            }else if(e.target.innerText === '기타'){
                filter = filter.replace(',기타', '')

            }

        }

        await tradeService.getList(page=1, filter, sorting, type, showList).then((text) => {
            tradeSection.innerHTML = text;
        });
    })
})

optionList.addEventListener("click", async (e) => {
    console.log(e.target.innerText)
    if(e.target.innerText.includes('관엽식물')){
        filter = filter.replace(',관엽식물', '')

    }else if(e.target.innerText.includes('침엽식물')){
        filter = filter.replace(',침엽식물', '')

    }else if(e.target.innerText.includes('희귀식물')){
        filter = filter.replace(',희귀식물', '')

    }else if(e.target.innerText.includes('다육')){
        filter = filter.replace(',다육', '')

    }else if(e.target.innerText.includes('선인장')){
        filter = filter.replace(',선인장', '')

    }else if(e.target.innerText.includes('기타')){
        filter = filter.replace(',기타', '')

    }else if(e.target.innerText.includes('최신순')) {
        sorting = '최신순'
    }else if(e.target.innerText.includes('인기순')) {
        sorting = '최신순'
    }else if(e.target.innerText.includes('스크랩순')) {
        sorting = '최신순'
    }else if(e.target.innerText.includes('상품')) {
        type = '상품'
    }else if(e.target.innerText.includes('식물')) {
        type = '식물'
    }else if(e.target.innerText.includes('수공예품')) {
        type = '수공예품'
    }else if(e.target.innerText.includes('테라리움')) {
        type = '테라리움'
    }else if(e.target.innerText.includes('기타')) {
        type = '기타'
    }

    await tradeService.getList(page=1, filter, sorting, type, showList).then((text) => {
            tradeSection.innerHTML = text;
    });
})

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
tradeService.getList(page++, filter, sorting, type, showList).then((text) => {
            tradeSection.innerHTML += text;
});

// 스크롤 할때마다 실행
// let check = false;
// window.addEventListener("scroll", async () => {
//     if (check) return;
//     check = true;
//     const optionBtn = document.querySelector('.option-reset-btn')
//
//     // 맨위
//     const scrollTop = document.documentElement.scrollTop;
//     // const scrollTop = window.scrollY;
//     // 페이지 높이
//     const windowHeight = window.innerHeight;
//     // const windowHeight = window.innerHeight;
//     // 암튼 높이
//     const totalHeight = document.documentElement.scrollHeight;
//     // const totalHeight = document.body.scrollHeight;
//     // 전체 높이에서 내가 보는 스크롤이 total보다 크면 추가
//
//     if (scrollTop + windowHeight >= totalHeight) {
//         let previousPage = page;
//         if(optionBtn.previousElementSibling) {
//             await tradeService.getList(++page, filter, sorting, type, showList).then((text) => {
//                 tradeSection.innerHTML += text;
//             });
//             const trades = await tradeService.getList(page, filter, sorting, type);
//             if (trades.length === 0) {
//                 page = previousPage;
//                 return;
//             }
//         }else {
//             // console.log('들어옴')
//
//             await tradeService.getList(page++, filter, sorting, type, showList).then((text) => {
//                 tradeSection.innerHTML += text;
//             });
//             const trades = await tradeService.getList(page, filter, sorting, type);
//             if (trades.length === 0) {
//                 page = previousPage;
//                 return;
//             }
//         }
//     }
//     check = false;
// });


window.addEventListener("scroll", () => {
    const optionBtn = document.querySelector('.option-reset-btn')

    // 맨위
    const scrollTop = document.documentElement.scrollTop;
    // 페이지 높이
    const windowHeight = window.innerHeight;
    // 암튼 높이
    const totalHeight = document.documentElement.scrollHeight;
    // 전체 높이에서 내가 보는 스크롤이 total보다 크면 추가

    // console.log(optionBtn.previousElementSibling)


    if (scrollTop + windowHeight >= totalHeight) {
        if(optionBtn.previousElementSibling) {
            tradeService.getList(++page, filter, sorting, type, showList).then((text) => {
                tradeSection.innerHTML += text;

            });
        }else{
            tradeService.getList(page++, filter, sorting, type, showList).then((text) => {
                tradeSection.innerHTML += text;

            });
        }
    }
});