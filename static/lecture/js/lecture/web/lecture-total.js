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
const fieldSelecter = document.querySelector(".field-selecter");
fieldSelecter.addEventListener("click", (e) => {
  const modalMenuBtns = fieldSelecter.querySelectorAll(".modal-menu-btn");
  if (e.target.closest(".modal-menu-btn")) {
    modalMenuBtns.forEach((btn) => {
      btn.classList.remove("choice");
    });
    e.target.closest(".modal-menu-btn").classList.add("choice");
    fieldSelecter.querySelector(".filter-btn").classList.add("choice");
    const fieldItem = document.querySelector(".field-item");
    if (!fieldItem) {
      const optionItem = document.createElement("span");
      optionItem.classList.add("option-item");
      optionItem.classList.add("field-item");
      optionItem.innerHTML = `
        <button class="option-cancel-btn">
          ${e.target.innerText}
          ${optionCancelIcon}
        </button>
      `;
      const parentElement = optionResetBtn.parentNode;
      parentElement.insertBefore(optionItem, optionResetBtn);
    } else {
      fieldItem.innerHTML = `
      <button class="option-cancel-btn">
        ${e.target.innerText}
        ${optionCancelIcon}
      </button>
    `;
    }
  }
  childObserver();
});
const onOffSelecter = document.querySelector(".onoff-selecter");
// onOffSelecter.addEventListener("click", (e) => {
//   const modalMenuBtns = onOffSelecter.querySelectorAll(".modal-menu-btn");
//   if (e.target.closest(".modal-menu-btn")) {
//     modalMenuBtns.forEach((btn) => {
//       btn.classList.remove("choice");
//     });
//     e.target.closest(".modal-menu-btn").classList.add("choice");
//     onOffSelecter.querySelector(".filter-btn").classList.add("choice");
//     const onOffItem = document.querySelector(".onoff-item");
//     if (!onOffItem) {
//       const optionItem = document.createElement("span");
//       optionItem.classList.add("option-item");
//       optionItem.classList.add("onoff-item");
//       optionItem.innerHTML = `
//         <button class="option-cancel-btn">
//           ${e.target.innerText}
//           ${optionCancelIcon}
//         </button>
//       `;
//       const parentElement = optionResetBtn.parentNode;
//       parentElement.insertBefore(optionItem, optionResetBtn);
//     } else {
//       onOffItem.innerHTML = `
//       <button class="option-cancel-btn">
//         ${e.target.innerText}
//         ${optionCancelIcon}
//       </button>
//     `;
//     }
//   }
//   childObserver();
// });
// const areaSelecter = document.querySelector(".area-selecter");
// areaSelecter.addEventListener("click", (e) => {
//   const modalMenuBtns = areaSelecter.querySelectorAll(".modal-menu-btn");
//   if (e.target.closest(".modal-menu-btn")) {
//     modalMenuBtns.forEach((btn) => {
//       btn.classList.remove("choice");
//     });
//     e.target.closest(".modal-menu-btn").classList.add("choice");
//     areaSelecter.querySelector(".filter-btn").classList.add("choice");
//     const areaItem = document.querySelector(".area-item");
//     if (!areaItem) {
//       const optionItem = document.createElement("span");
//       optionItem.classList.add("option-item");
//       optionItem.classList.add("area-item");
//       optionItem.innerHTML = `
//         <button class="option-cancel-btn">
//           ${e.target.innerText}
//           ${optionCancelIcon}
//         </button>
//       `;
//       const parentElement = optionResetBtn.parentNode;
//       parentElement.insertBefore(optionItem, optionResetBtn);
//     } else {
//       areaItem.innerHTML = `
//       <button class="option-cancel-btn">
//         ${e.target.innerText}
//         ${optionCancelIcon}
//       </button>
//     `;
//     }
//   }
//   childObserver();
// });
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
        if (e.target.closest(".field-item")) {
          let targetBtnBox = e.target
            .closest(".filter-wrap")
            .querySelector(".field-selecter");
          const options = targetBtnBox.querySelectorAll(".option");
          options.forEach((item) => {
            item.classList.remove("choice");
          });
        }
        if (e.target.closest(".onoff-item")) {
          let targetBtnBox = e.target
            .closest(".filter-wrap")
            .querySelector(".onoff-selecter");
          const options = targetBtnBox.querySelectorAll(".option");
          options.forEach((item) => {
            item.classList.remove("choice");
          });
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

//스크랩 버튼

const scrapPopup = document.querySelector(".scrap-popup-wrap");
const scrapCancel = document.querySelector(".scrap-popup-cancel-wrap");

let timeoutId;
let animationTarget;

const transScrapBtnFn = (target) => {
  const img = target.querySelector("img");
  const imgSrc = img.getAttribute("src");
  if (imgSrc === "/static/public/web/images/common/scrap-off.png") {
    img.setAttribute("src", "/static/public/web/images/common/scrap-on.png");
    animationTarget && animationTarget.classList.remove("show-animation");
    animationTarget = scrapPopup;
  } else {
    img.setAttribute("src", "/static/public/web/images/common/scrap-off.png");
    animationTarget.classList.remove("show-animation");
    animationTarget = scrapCancel;
  }
  animationTarget.classList.remove("hide-animation");
  animationTarget.classList.add("show-animation");
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    animationTarget.classList.remove("show-animation");
    animationTarget.classList.add("hide-animation");
  }, 3000);

}

const postWrap = document.querySelector('.post-wrap')
postWrap.addEventListener('click', async (e) => {
  const scrapBtn = e.target.closest('.scrap-button')
  transScrapBtnFn(scrapBtn)
  const lectureContentId = scrapBtn.closest('.post-container').classList[1]
  await lectureScrapService.update(lectureContentId)
})


const plantSelections = document.querySelectorAll(".plant-selection");
plantSelections.forEach((plantSelection) => {
  plantSelection.addEventListener("click", (e) => {
    plantSelection.classList.toggle("select-on");
    plantSelection.innerHTML = `<img>`;
  });
});

// ============================================================================================================

// 게시물 목록 보기
let page = 1;

const lectureSection = document.querySelector(".post-wrap");
const filterItems = document.querySelectorAll(".filter-item")
const optionList = document.querySelector('.option-list')
const sortChoices = document.querySelectorAll(".menu-choice")
const optionReset = document.querySelector(".option-reset-btn")

let filter = `전체`;
let sorting = `최신순`
let type = '전체'

optionReset.addEventListener("click", () => {
    filter = '전체'
    sorting = '최신순'
    type = '전체'
    lectureService.getList(page=1, filter, sorting, type, showList).then((text) => {
            lectureSection.innerHTML = text;
        });
})

sortChoices.forEach((sort) => {
    sort.addEventListener("click", () => {
        console.log(sort)
        if (sort.innerText === "최신순") {
            sorting = '최신순'
        }else if(sort.innerText === "스크랩순"){
            sorting = '스크랩순'
        }else if(sort.innerText === "리스/트리") {
            type = '리스/트리'
        }else if(sort.innerText === "바구니/센터피스/박스") {
            type = '바구니/센터피스/박스'
        }else if(sort.innerText === "가드닝/테라리움") {
            type = '가드닝/테라리움'
        }else if(sort.innerText === "기타") {
            type = '기타'
        }

        lectureService.getList(page=1, filter, sorting, type, showList).then((text) => {
            lectureSection.innerHTML = text;
        });

    })
})

filterItems.forEach((item) => {
    item.addEventListener('click', (e) => {

        if(item.children[0].classList[3] === 'choice'){
            filter += `,${e.target.innerText}`

        }else {
            if(e.target.innerText === '관엽식물'){
                filter = filter.replace(',관엽식물', '')

            }else if(e.target.innerText === '침엽식물'){
                filter = filter.replace(',침엽식물', '')

            }else if(e.target.innerText === '희귀식물'){
                filter = filter.replace(',희귀식물', '')

            }else if(e.target.innerText === '다육/선인장'){
                filter = filter.replace(',다육/선인장', '')

            }else if(e.target.innerText === '기타'){
                filter = filter.replace(',기타', '')

            }

        }
        lectureService.getList(page=1, filter, sorting, type, showList).then((text) => {
            lectureSection.innerHTML = text;
        });
        lectureService.getList(page++, filter, sorting, type, showList).then((filteringCount) => {
            lectureSection.innerHTML = filteringCount;
        });
        console.log(filter, sorting, type )

    })
})


optionList.addEventListener("click", (e) => {
    console.log(e.target.innerText)
    if(e.target.innerText.includes('관엽식물')){
        filter = filter.replace(',관엽식물', '')

    }else if(e.target.innerText.includes('침엽식물')){
        filter = filter.replace(',침엽식물', '')

    }else if(e.target.innerText.includes('희귀식물')){
        filter = filter.replace(',희귀식물', '')

    }else if(e.target.innerText.includes('다육/선인장')){
        filter = filter.replace(',다육/선인장', '')

    }else if(e.target.innerText.includes('기타')){
        filter = filter.replace(',기타', '')

    }else if(e.target.innerText.includes('최신순')) {
        sorting = '최신순'
    }else if(e.target.innerText.includes('스크랩순')) {
        sorting = '최신순'
    }else if(e.target.innerText.includes('리스/트리')) {
        type = '전체'
    }else if(e.target.innerText.includes('바구니/센터피스/박스')) {
        type = '전체'
    }else if(e.target.innerText.includes('가드닝/테라리움')) {
        type = '전체'
    }else if(e.target.innerText.includes('기타')) {
        type = '전체'
    }

    // console.log(filter)
    lectureService.getList(page=1, filter, sorting, type, showList).then((text) => {
            lectureSection.innerHTML = text;
        });
    lectureService.getList(page++, filter, sorting, type, showList).then((filteringCount) => {
        lectureSection.innerHTML = filteringCount;
    });

})


const showList = (lectures, onlineStatus = false) => {
    let text = ``;
console.log(lectures)
    // 강의 목록을 순회하면서 HTML 템플릿 생성
    lectures['lectures'].forEach((lecture) => {
        let tagsHtml = '';
        lecture.plant_name.forEach((pn) => {
            tagsHtml += `<span class="post-tag-icon">#${pn}</span>`;
        });
        console.log(lecture)
        // 온라인 상태에 따라 링크 주소 결정
        const detailLink = onlineStatus ? `/lecture/detail/online?id=${lecture.id}` : `/lecture/detail/offline?id=${lecture.id}`;

        // HTML 템플릿 생성
        text += `
            <div class="post-container ${lecture.id}">
                <div class="post-inner">
                    <article class="post">
                        <a href="${detailLink}" class="post-link"></a>
                        <div class="post-image-wrap_">
                            <div class="post-image-container">
                                <div class="post-image-inner">
                                    <div class="post-image"></div>
                                    <img src="/upload/${lecture.lecture_file}" alt class="image"/>
                                    <button class="scrap-button" type="button">
                                        <img src="${lecture.lecture_scrap ? '/static/public/web/images/common/scrap-on.png' : '/static/public/web/images/common/scrap-off.png'}" alt class="scrap-img"/>
                                    </button>
                                    <div class="image__dark-overlay"></div>
                                </div>
                            </div>
                        </div>
                        <div class="post-contents-wrap">
                            <div class="post-contents-container">
                                <h1 class="post-contents-header">
                                    <span class="post-contents-user">${lecture.teacher__member__member_name}</span>
                                    <span class="post-contents-banner">${lecture.lecture_title}</span>
                                </h1>
                                <span class="post-price">
                                    <span class="post-price-letter">${lecture.lecture_price}원</span>
                                </span>
                                <span class="post-tag">${tagsHtml}</span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        `;
    });

    return text;
};

const filterCount = (lectures) => {
    filteringCount = `${lectures['lectures_count']}개의 강의가 있어요!`
    return filteringCount
}


// 처음 화면에 나오는거
lectureService.getList(page++, filter, sorting, type, showList).then((text) => {
            lectureSection.innerHTML += text;
        });
// const totalLectures = document.querySelector(".total-data")
// lectureService.getList(page++, filter, sorting, type, filterCount).then((filteringCount) => {
//     totalLectures.innerText = filteringCount;
// });


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
        lectureService.getList(++page, filter, sorting, type, showList).then((text) => {
            lectureSection.innerHTML += text;
        });
    }
});