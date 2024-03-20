let page = 1;

const postSection = document.querySelector(".content-line-box");
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
    postService.getList(page=1, filter, sorting, type, showList).then((text) => {
            postSection.innerHTML = text;
        });
})

sortChoices.forEach((sort) => {
    sort.addEventListener("click", async () => {
        // console.log(sort)
        if (sort.innerText === "최신순") {
            sorting = '최신순'
        }else if(sort.innerText === "인기순") {
            sorting = '인기순'
        }else if(sort.innerText === "스크랩순"){
            sorting = '스크랩순'
        }else if(sort.innerText === "식물 키우기") {
            type = '식물 키우기'
        }else if(sort.innerText === "관련 제품") {
            type = '관련 제품'
        }else if(sort.innerText === "테라리움") {
            type = '테라리움'
        }else if(sort.innerText === "스타일링") {
            type = '스타일링'
        }
        // console.log(type)

        postService.getList(page=1, filter, sorting, type, showList).then((text) => {
            postSection.innerHTML = text;
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

            }else if(e.target.innerText === '다육'){
                filter = filter.replace(',다육', '')

            }else if(e.target.innerText === '선인장'){
                filter = filter.replace(',선인장', '')

            }else if(e.target.innerText === '기타'){
                filter = filter.replace(',기타', '')

            }

        }
        postService.getList(page=1, filter, sorting, type, showList).then((text) => {
            postSection.innerHTML = text;
        });
        postService.getList(page++, filter, sorting, type, filterCount).then((filteringCount) => {
            totalposts.innerText = filteringCount;
        });
        // console.log(filter)

    })
})


optionList.addEventListener("click", (e) => {
    // console.log(e.target.innerText)
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
    }else if(e.target.innerText.includes('식물 키우기')) {
        type = '전체'
    }else if(e.target.innerText.includes('관련제품')) {
        type = '전체'
    }else if(e.target.innerText.includes('테라리움')) {
        type = '전체'
    }else if(e.target.innerText.includes('스타일링')) {
        type = '전체'
    }

    // console.log(filter)
    postService.getList(page=1, filter, sorting, type, showList).then((text) => {
            postSection.innerHTML = text;
        });
    postService.getList(page++, filter, sorting, type, filterCount).then((filteringCount) => {
            totalposts.innerText = filteringCount;
        });

})

const showList = (posts) => {
    let text = ``;

    console.log(posts['posts'])

    posts['posts'].forEach((post) => {
        text += `
            <a href="/post/detail/?id=${post.id}" class="post-content-wrap">
                <div class="content-item-wrap">
                  <div class="content-item-container">
                    <div class="content-img-box">
                      <img
                        src="/upload/${post.post_file}"
                        class="content-img"
                      />
                      <div class="scrap-btn-box">
                        <button
                          type="button"
                          aria-label="scrap 토글 버튼"
                          class="scrap-btn"
                        >
                          <span class="scrap-icon-box">
                            <img
                              src=""
                              alt=""
                            />
                          </span>
                        </button>
                      </div>
                    </div>
                    <p class="content-title">
                        ${post.post_title}
                    </p>
                    <div class="content-bottom-box">
                      <div class="content-uploader">
                        <div class="uploader-img-box">
            `;
            if(post.profile.includes('http://') || post.profile.includes('https://')) {
                text += `
                          <img
                            src="${post.profile}"
                            class="uploader-img"
                          />
                         `;
            }else if (post.profile.includes('file/20')) {
                text += `
                            <img src="/upload/${post.profile}"
                                 class="uploader-img"
                              />
                        `;
            }else {
                        `
                            <img src="/selleaf/static/public/web/images/common/selleaf.png"
                                 class="uploader-img"
                              />
                        `;
            }

            text += `
                        </div>
                        <span class="uploader-name">${post.member_name}</span>
                      </div>
                      <div class="content-data-box">
                        <span class="content-data scrap-content"
                          >스크랩 <span>${post.scrap_count}</span>
                        </span>
                        <span class="content-data count-content"
                          >조회수 <span>${post.post_count}</span>
                        </span>
                        <span class="content-data like-content"
                          >좋아요 <span>${post.like_count}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
            </a>
            `;
    });

    return text;
}

const filterCount = (posts) => {
    filteringCount = `${posts['posts_count']}개의 게시글이 있어요!`
    return filteringCount
}

// window.addEventListener('DOMContentLoaded', () => {
//     postService.getList(page++, filter, showList).then((text) => {
//             postSection.innerHTML += text;
//         });
// })

// 처음 화면에 나오는거
postService.getList(page++, filter, sorting, type, showList).then((text) => {
    postSection.innerHTML += text;
});

const totalposts = document.querySelector(".total-data")
postService.getList(page, filter, sorting, type, filterCount).then((filteringCount) => {
    totalposts.innerText = filteringCount;
});



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
        // console.log(111)
        postService.getList(page++, filter, sorting, type, showList).then((text) => {
                postSection.innerHTML += text;

            });

    }
});















