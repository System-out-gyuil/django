let page = 1
let keyword = ''

// 페이지네이션 버튼 클릭 시 발생하는 이벤트 추가하는 함수
const addPaginationEvent = (pageInfo) => {
    const pageCountPrev = document.querySelector(".page-count-prev")
    const pageCountNext = document.querySelector(".page-count-next")
    const pageCountNumBtns = document.querySelectorAll("button.page-count-num")
    const pageCountNumSpans = document.querySelectorAll("span.page-count-num")

    if (pageInfo.page > 1) {
        pageCountPrev.addEventListener("click", async () => {
            await manageTag.getTags(keyword, --page, createHTML.showList);
        })
    }

    if (pageInfo.page !== pageInfo.realEnd){
        pageCountNext.addEventListener("click", async () => {
            await manageTag.getTags(keyword, ++page, createHTML.showList);
        })
    }

    pageCountNumBtns.forEach((btn, i) => {
        btn.addEventListener("click", async () => {
            page = pageCountNumSpans[i].innerText;
            await manageTag.getTags(keyword, page, createHTML.showList);
        })
    })
}

// 받아온 댓글들의 정보를 뿌려주는 함수
const allNum = document.querySelector(".all-num")
const listContent = document.querySelector(".list-content")
const pageCountWrap = document.querySelector(".page-count-wrap")

const createHTML = (() => {
    const showList = async (tags) => {
        let text = ``;
        let pageInfo = tags.pop()
        allNum.innerText = pageInfo.totalCount

        if (tags.length === 0){
            text += `
                <div class="nothing">
                    <img src="/static/public/web/images/manager/nothing.png" class="nothing"/>
                    <p class="nothing">해당 내역이 없습니다.</p>
                </div>
            `
        } else{
            for (let tag of tags){
                text += `
                    <li class="list-content">
                        <input name="target" type="checkbox" class="checkbox-input"/>
                        <button class="text-left">
                            <div class="list-content-wrap">
                                <div class="list-content-container">
                                    <div class="list-content-inner">
                                        <div class="content-name">
                                            <p class="content-name"># ${tag.tag_name}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </li>
                `
            }
        }
        listContent.innerHTML = text;
        showPagination(pageInfo)
        checkboxEvent()
    }

    // 전달받은 페이지 관련 정보를 통해 페이지네이션 버튼을 만들어주는 함수
    const showPagination = (pageInfo) => {
        const totalCount = pageInfo.totalCount;
        const startPage = pageInfo.startPage;
        const endPage = pageInfo.endPage;
        const currentPage = pageInfo.page;
        const realEnd = pageInfo.realEnd;
        let text = ``;
        if (totalCount === 0) {
            text = ``;
        } else{
            if (currentPage !== 1) {
                text = `
                    <button class="page-count-prev" aria-label="page turning button" type="button">
                        <svg class="page-count" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.58 3.27c.504.405.563 1.115.13 1.587L9.168 12l6.543 7.143a1.076 1.076 0 0 1-.13 1.586 1.26 1.26 0 0 1-1.695-.122L6 12l7.885-8.607a1.26 1.26 0 0 1 1.695-.122Z"></path>
                        </svg>
                    </button>
                `;
            }
            for (let i = startPage; i <= endPage; i++) {
                text += `
                    <button class="page-count-num ${currentPage === i ? 'page-count-num-choice' : ''}" aria-label="page number button" type="button">
                        <span class="page-count-num">${i}</span>
                    </button>
            `
            }
            if (currentPage !== realEnd) {
                text += `
                    <button class="page-count-next" aria-label="page turning button" type="button">
                        <svg class="page-count" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.42 20.73a1.076 1.076 0 0 1-.13-1.587L14.832 12 8.289 4.857a1.076 1.076 0 0 1 .13-1.586 1.26 1.26 0 0 1 1.696.122L18 12l-7.885 8.607a1.26 1.26 0 0 1-1.695.122Z"></path>
                        </svg>
                    </button>
                `;
            }
        }
        pageCountWrap.innerHTML = text
        if (text !== ``) {
            addPaginationEvent(pageInfo)
        }
    }

    return {showList: showList}
})()

manageTag.getTags(keyword, page, createHTML.showList)

// 삭제 버튼 누르면 뜨는 모달창
const deleteButton = document.querySelector(".delete-button");
const deleteModalWrap = document.querySelector(".delete-modal-wrap")
const deleteModalInner = document.querySelector(".delete-modal-inner")

deleteButton.addEventListener("click", () => {
    const checkedTargets = document.querySelectorAll("input[name=target]:checked")
    if (checkedTargets.length === 0) {
        // 원하시는 문구로 수정하시면 됩니다.
        deleteModalInner.innerText = "선택하신 태그가 없습니다.\n다시 한번 확인해주세요."
    } else{
        deleteModalInner.innerText = "해당 태그를 삭제하시겠습니까?"
    }
    deleteModalWrap.style.display = "flex";
})

const deleteModalBgcolor = document.querySelector(".delete-modal-bgcolor")
deleteModalBgcolor.addEventListener("click", () => {
    deleteModalWrap.style.display = "none";
})

const modalCancel = document.querySelector(".modal-cancel")
modalCancel.addEventListener("click", () => {
    deleteModalWrap.style.display = "none";
})

const modalConfirm = document.querySelector(".modal-confirm")
modalConfirm.addEventListener("click", async () => {
    const checkedTargets = document.querySelectorAll("input[name=target]:checked")
    let tagInfo = {}
    let tagList = []

    if (checkedTargets.length !== 0){
        checkedTargets.forEach((checkedTarget, i) => {
            const targetWrap = checkedTarget.closest(".list-content")
            const tagName = targetWrap.querySelector("p.content-name")

            tagInfo = {
                tag_name: tagName.innerText.slice(2,)
            };
            tagList.push(tagInfo);
        })

        await manageTag.remove(tagList);
        await manageTag.getTags(keyword, page, createHTML.showList)
    }

    deleteModalWrap.style.display = "none";
})

// 검색창 눌렀을때 검색바에 아웃라인주기
const searchBar = document.querySelector("label.search-bar");

document.addEventListener("click", (e) => {
  if (e.target.closest("label.search-bar")) {
    searchBar.classList.add("search-bar-checked");
    return;
  }
  searchBar.classList.remove("search-bar-checked");
});

// 입력 필드에 입력 내용이 변경될 때마다 실행될 함수를 정의합니다.
const inputField = document.querySelector(".search-bar input");
const cancelButton = document.querySelector(".search-bar .cancel-logo");
const searchButton = document.querySelector(".search-bar .search-logo");

// 검색창에 엔터 입력 시 키워드로 검색하여 페이지를 뿌려주는 이벤트
inputField.addEventListener("keyup", async (e) => {
    if (e.keyCode === 13) {
        keyword = inputField.value
        page = 1
        await manageTag.getTags(keyword, page, createHTML.showList)
    }
})

// 입력 필드에 입력 내용이 변경될 때마다 실행될 함수를 정의합니다.
function handleInputChange() {
  const inputValue = inputField.value.trim(); // 입력 내용을 가져옵니다.

  // 입력 내용이 있을 때
  if (inputValue !== "") {
    cancelButton.style.display = "flex"; // cancel-logo를 보여줍니다.
    searchButton.style.display = "none"; // search-logo를 숨깁니다.
  } else {
    // 입력 내용이 없을 때
    cancelButton.style.display = "none"; // cancel-logo를 숨깁니다.
    searchButton.style.display = "flex"; // search-logo를 보여줍니다.
  }
}

// cancel-logo를 클릭했을 때 실행될 함수를 정의합니다.
const handleCancelClick = async () => {
    inputField.value = ""; // 입력 필드 내용을 지웁니다.
    cancelButton.style.display = "none"; // cancel-logo를 숨깁니다.
    searchButton.style.display = "flex"; // search-logo를 보여줍니다.
    keyword = inputField.value
    page = 1
    await manageTag.getTags(keyword, page, createHTML.showList)
}

// 입력 필드에 이벤트 리스너를 추가합니다.
inputField.addEventListener("input", handleInputChange);

// cancel-logo에 클릭 이벤트 리스너를 추가합니다.
cancelButton.addEventListener("click", handleCancelClick);

const checkboxEvent = () => {
    // 체크박스 js
    const allCheck = document.querySelector(".all-check");
    const checkboxes = document.querySelectorAll(".checkbox-input");

    // all-check 체크 여부에 따라 checkbox-input 체크 여부 조절
    allCheck.addEventListener("change", function () {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = allCheck.checked;
        });
    });

    // checkbox-input 중 하나라도 체크가 해제되면 all-check 체크 해제
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            let allChecked = true;
            checkboxes.forEach(function (checkbox) {
                if (!checkbox.checked) {
                    allChecked = false;
                }
            });
            allCheck.checked = allChecked;
        });
    });

    // checkbox-input 모두 체크되면 all-check 체크
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener("change", function () {
            let allChecked = true;
            checkboxes.forEach(function (checkbox) {
                if (!checkbox.checked) {
                    allChecked = false;
                }
            });
            allCheck.checked = allChecked;
        });
    });
}

// // 삭제 버튼 누르면 뜨는 모달창
// document.addEventListener("DOMContentLoaded", function () {
//   const deleteButtons = document.querySelectorAll(".delete-button");
//   const modalWrap = document.querySelector(".delete-modal-wrap");
//
//   console.log(deleteButtons);
//
//   deleteButtons.forEach(function (deleteButton) {
//     deleteButton.addEventListener("click", (e) => {
//       modalWrap.style.display = "flex";
//     });
//   });
//
//   const cancelButton = document.querySelector(".modal-cancel button");
//   const confirmButton = document.querySelector(".modal-confirm button");
//
//   cancelButton.addEventListener("click", (e) => {
//     modalWrap.style.display = "none";
//   });
//
//   confirmButton.addEventListener("click", (e) => {
//     modalWrap.style.display = "none";
//   });
// });
//
// //아래 게시물 창 버튼
// const paginationBtn = document.querySelectorAll(".page-count-num");
// const paginationBox = document.querySelector(".page");
//
// paginationBox.addEventListener("click", (e) => {
//   let pageBtn = e.target.closest("button.page-count-num");
//   if (pageBtn) {
//     paginationBtn.forEach((item) => {
//       item.classList.contains("page-count-num") &&
//         item.classList.remove("page-count-num-choice");
//     });
//     pageBtn.classList.add("page-count-num-choice");
//   }
// });