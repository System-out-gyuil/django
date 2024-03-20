let page = 1
let keyword = ''

// 페이지네이션 버튼 클릭 시 발생하는 이벤트 추가하는 함수 - 페이지네이션 dict 데이터 가져와서 키로 접근
const addPaginationEvent = (pageInfo) => {
    // 앞으로 가기, 뒤로 가기 버튼, 숫자 페이지 버튼, 페이지 수 표시되는 span 태그
    const pageCountPrev = document.querySelector(".page-count-prev")
    const pageCountNext = document.querySelector(".page-count-next")
    const pageCountNumBtns = document.querySelectorAll("button.page-count-num")
    const pageCountNumSpans = document.querySelectorAll("span.page-count-num")

    // 현재 페이지(받아온 dict 데이터의 page)가 1보다 클 때
    if (pageInfo.page > 1) {
        // 뒤로 가기 버튼 클릭 이벤트 추가 - 이전 페이지의 데이터 요청(키워드는 그대로 유지)
        pageCountPrev.addEventListener("click", async () => {
            await manageReply.getReply(keyword, --page, createHTML.showList);
        })
    }

    // 현재 페이지가 맨 끝 페이지가 아닐 때
    if (pageInfo.page !== pageInfo.realEnd){
        // 앞으로 가기 버튼 누르면 다음 페이지 데이터 요청
        pageCountNext.addEventListener("click", async () => {
            await manageReply.getReply(keyword, ++page, createHTML.showList);
        })
    }

    // 페이지 숫자 버튼 각각에 클릭 이벤트 추가
    pageCountNumBtns.forEach((btn, i) => {
        // 버튼 클릭 시 해당 버튼 안 숫자를 가져와서 page에 할당 -> 해당 페이지의 데이터 요청
        btn.addEventListener("click", async () => {
            page = pageCountNumSpans[i].innerText;
            await manageReply.getReply(keyword, page, createHTML.showList);
        })
    })

}


// 받아온 댓글들의 정보를 뿌려주는 함수
// 전체 댓글 수 표시할 태그, 댓글 리스트 뿌릴 태그, 페이지 버튼 감싸는 태그
const allNum = document.querySelector(".all-num")
const listContent = document.querySelector(".list-content")
const pageCountWrap = document.querySelector(".page-count-wrap")

// HTML 코드 생성 모듈
const createHTML = (() => {
    // 댓글 리스트 표시 - API 요청 데이터 전체(댓글 정보+페이지네이션 변수, 배열)를 인자로 받음
    const showList = async (replies) => {
        // HTML 코드를 담을 빈 문자열
        let text = ``;
        // 페이지네이션+전체 댓글 수를 담은 dict 데이터를 배열에서 분리해서 pageInfo에 할당
        let pageInfo = replies.pop()
        // 받아온 dict 데이터에서 전체 댓글 수를 화면에 표시
        allNum.innerText = pageInfo.totalCount

        // 댓글 정보가 없으면 내역 없음 표시
        if (replies.length === 0){
            text += `
                <div class="nothing">
                    <img src="/static/public/web/images/manager/nothing.png" class="nothing"/>
                    <p class="nothing">해당 내역이 없습니다.</p>
                </div>
            `
        }
        // 댓글 내역이 하나라도 있다면 아래 코드로 댓글 리스트 생성
        else{
            // 댓글 내역 각각을 HTML 코드에 담아서 text에 추가
            for (let reply of replies){
                text += `
                    <li class="list-content">
                        <input name="reply-member-id" type="hidden" value="${reply.reply_member_id}">
                        <input name="reply-created" type="hidden" value="${reply.reply_created}">
                        <input name="reply_id" type="hidden" value="${reply.reply_id}">
                        <input name="target" type="checkbox" class="checkbox-input" />
                        <div class="reply-writer">
                            <p class="writer-name">${reply.reply_member_name}</p>
                        </div>
                        <div class="target-type">
                            <p class="type-name">${reply.target_type}</p>
                        </div>
                        <div class="target-title">
                            <div class="list-title-wrap">
                                <div class="list-title-container">
                                    <div class="list-title-inner">
                                        <div class="title-name">
                                            <p class="title-name">${reply.target_title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="reply-content">
                            <div class="list-content-wrap">
                                <div class="list-content-container">
                                    <div class="list-content-inner">
                                        <div class="content-name">
                                            <p class="content-name">${reply.reply_content}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="created-date">
                            <p class="created-date-num">${reply.reply_created.slice(0,4)}.${reply.reply_created.slice(5,7)}.${reply.reply_created.slice(8,10)}</p>
                        </div>
                    </li>
                `
            }
        }
        // 완성한 댓글 내역을 화면에 표시
        listContent.innerHTML = text;
        // 페이지네이션 변수들로 만든 페이지 버튼도 화면에 표시
        showPagination(pageInfo)
        // 체크박스 클릭 이벤트 추가
        checkboxEvent()
    }

    // 전달받은 페이지 관련 정보를 통해 페이지네이션 버튼을 만들어주는 함수 - 페이지네이션 변수(dict)를 인자로 받음
    const showPagination = (pageInfo) => {
        const totalCount = pageInfo.totalCount; // 전체 댓글 수
        const startPage = pageInfo.startPage; // 한 번에 표시되는 페이지 숫자 버튼 중 맨 처음 페이지
        const endPage = pageInfo.endPage; // 한 번에 표시되는 페이지 숫자 버튼 중 맨 마지막 페이지
        const currentPage = pageInfo.page; // 요청받은 현재 페이지
        const realEnd = pageInfo.realEnd; // 댓글 리스트의 맨 마지막 페이지

        // 페이지네이션 HTML 코드를 담을 빈 문자열
        let text = ``;
        // 댓글이 하나도 없다면 페이지네이션 버튼 표시 안 함
        if (totalCount === 0) {
            text = ``;
        }
        // 댓글이 하나라도 있다면 아래 코드로 페이지네이션 버튼 추가
        else{
            // 현재 페이지가 1이 아니라면 뒤로 가기 버튼 표시
            if (currentPage !== 1) {
                text = `
                    <button class="page-count-prev" aria-label="page turning button" type="button">
                        <svg class="page-count" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.58 3.27c.504.405.563 1.115.13 1.587L9.168 12l6.543 7.143a1.076 1.076 0 0 1-.13 1.586 1.26 1.26 0 0 1-1.695-.122L6 12l7.885-8.607a1.26 1.26 0 0 1 1.695-.122Z"></path>
                        </svg>
                    </button>
                `;
            }
            // 한 번에 표시되는 페이지 숫자 버튼 - 한 번에 5개씩 표시됨(1~5, 6~10, ...)
            // 현재 페이지에 해당하는 버튼에는 다른 스타일 부여
            for (let i = startPage; i <= endPage; i++) {
                text += `
                    <button class="page-count-num ${currentPage === i ? 'page-count-num-choice' : ''}" aria-label="page number button" type="button">
                        <span class="page-count-num">${i}</span>
                    </button>
            `
            }
            // 현재 페이지가 마지막이 아닌 경우 앞으로 가기 버튼 표시
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
        // 완성된 페이지네이션 버튼을 화면에 표시
        pageCountWrap.innerHTML = text
        // 페이지네이션 버튼이 생성된 경우, 위에서 만든 페이지네이션 이벤트 추가
        if (text !== ``) {
            addPaginationEvent(pageInfo)
        }
    }

    // 댓글 내역 표시 기능만 반환 - 페이지네이션 버튼 표시도 같이 실행
    // 페이지네이션 버튼만 화면에 표시할 이유가 없기 때문
    return {showList: showList}
})()

// 페이지 열렸을 때 댓글 리스트 불러와서 화면에 표시
// 처음에는 별도의 검색 조건이 적용되지 않은 댓글 리스트의 1페이지 표시
manageReply.getReply(keyword, page, createHTML.showList)



// // 삭제 버튼 누르면 뜨는 모달창
// 삭제 버튼, 삭제 모달창, 삭제 모달창 내 메세지
const deleteButton = document.querySelector(".delete-button");
const deleteModalWrap = document.querySelector(".delete-modal-wrap")
const deleteModalInner = document.querySelector(".delete-modal-inner")

// 삭제 버튼 클릭 이벤트 추가
deleteButton.addEventListener("click", () => {
    // 체크된 상태의 체크박스들
    const checkedTargets = document.querySelectorAll("input[name=target]:checked")

    // 체크된 박스가 없다면 모달창에 '선택한 댓글 없음' 텍스트 표시
    if (checkedTargets.length === 0) {
        // 원하시는 문구로 수정하시면 됩니다.
        deleteModalInner.innerText = "선택하신 댓글이 없습니다.\n다시 한번 확인해주세요."
    }
    // 하나라도 체크했다면 삭제 확인 메세지 출력
    else{
        deleteModalInner.innerText = "해당 댓글을 삭제하시겠습니까?"
    }

    // 삭제 버튼 클릭 시 모달창 표시
    deleteModalWrap.style.display = "flex";
})

// 모달창이 표시되었을 때 나오는 어두운 배경 태그
const deleteModalBgcolor = document.querySelector(".delete-modal-bgcolor")

// 모달창이 표시된 상태에서 배경 클릭 시 모달창 숨김
deleteModalBgcolor.addEventListener("click", () => {
    deleteModalWrap.style.display = "none";
})

// 모달창 내 취소 버튼(삭제 취소)
const modalCancel = document.querySelector(".modal-cancel")

// 모달창 내 취소 버튼 클릭 시 모달창 숨김
modalCancel.addEventListener("click", () => {
    deleteModalWrap.style.display = "none";
})

// 모달창 내 삭제 버튼(삭제 실행)
const modalConfirm = document.querySelector(".modal-confirm")

// 모달창 내 삭제 버튼 클릭 이벤트 추가
modalConfirm.addEventListener("click", async () => {
    // 현재 체크된 체크박스들
    const checkedTargets = document.querySelectorAll("input[name=target]:checked")

    let replyInfo = {} // 삭제할 댓글 각각의 정보를 담을 빈 객체
    let replyList = []  // 삭제할 댓글 목록을 담을 빈 배열

    // 만약 모달창 내 삭제 버튼 클릭 시점에서 댓글 목록에 뭐라도 있다면
    if (Object.keys(replyList).length !== 0){
        // 각각의 체크박스에 대해서 아래 코드를 실행
        checkedTargets.forEach((checkedTarget, i) => {
            // 먼저 체크박스에서 가장 가까이 있는 'list-content' 클래스를 가진 상위 태그를 가져옴
            const targetWrap = checkedTarget.closest(".list-content")

            // 위 태그 내에서 댓글을 작성한 회원의 id, 댓글 작성 시점, 댓글이 달린 게시물 유형(일반, 노하우)을 담은 태그들을 각각 가져옴
            const replyMemberId =  targetWrap.querySelector("input[name=reply-member-id]")
            const replyCreated = targetWrap.querySelector("input[name=reply-created]")
            const typeName = targetWrap.querySelector(".type-name")

            // 위 태그 내 값으로 객체 데이터 생성 - 삭제를 실행하기 위한 댓글 하나의 정보
            replyInfo = {
                reply_member_id: replyMemberId.value,
                reply_created: replyCreated.value,
                target_type: typeName.innerText
            };
            // 댓글 정보를 잘 가져왔는지 검사
            // console.log(replyInfo)

            // 삭제할 댓글 리스트에 완성된 객체 데이터 추가
            replyList.push(replyInfo);
        })
        // 이 시점에서 각 인덱스에 삭제할 댓글의 정보(객체 타입)이 담긴 배열이 완성되었을 것

        // 가져온 댓글들의 삭제를 API에 비동기로 요청
        await manageReply.remove(replyList);
        // 다시 현재 페이지의 댓글 목록 표시
        await manageReply.getReply(keyword, page, createHTML.showList);
    }

    // 삭제 모달창 숨김
    deleteModalWrap.style.display = "none";
})

// 검색창 눌렀을때 검색바에 아웃라인주기
const searchBar = document.querySelector("label.search-bar");

// 검색창 클릭 이벤트 추가
document.addEventListener("click", (e) => {
    // 검색창 내 요소를 클릭해도 이벤트 발생
    if (e.target.closest("label.search-bar")) {
        // 검색창에 테두리 추가
        searchBar.classList.add("search-bar-checked");
        return;
    }
    // 검색창 외부 클릭 시 검색창 테두리 원복
    searchBar.classList.remove("search-bar-checked");
});

// 입력 필드에 입력 내용이 변경될 때마다 실행될 함수를 정의합니다.
// 검색창 내 input(입력) 태그, 취소 버튼, 검색(돋보기) 버튼
const inputField = document.querySelector(".search-bar input");
const cancelButton = document.querySelector(".search-bar .cancel-logo");
const searchButton = document.querySelector(".search-bar .search-logo");

// 검색창에 엔터 입력 시 키워드로 검색하여 페이지를 뿌려주는 이벤트
inputField.addEventListener("keyup", async (e) => {
    // 검색창 내에서 엔터 입력 시 아래 코드 실행
    if (e.keyCode === 13) {
        // 입력창 내 값을 keyword에 할당
        keyword = inputField.value
        // 잘 가져왔는지 검사
        // console.log(keyword)
        // 페이지 값 1로 원복
        page = 1
        // 위의 keyword가 포함된 회원 닉네임 or 내용이 담긴 댓글 리스트의 1페이지를 불러옴
        await manageReply.getReply(keyword, page, createHTML.showList)
    }
})

// 검색창에 입력한 값이 있으면 취소 버튼, 입력한 값이 없으면 검색 버튼 표시되게 만들어주는 함수
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

// 검색창 내 취소 버튼에 추가할 이벤트 함수
const handleCancelClick = async () => {
    inputField.value = ""; // 검색창 입력값 초기화
    cancelButton.style.display = "none"; // 취소 버튼 숨김
    searchButton.style.display = "flex"; // 검색 버튼 표시

    keyword = inputField.value // keyword는 현재 빈 문자열(검색 조건 없음)
    page = 1 // 페이지 1로 초기화
    await manageReply.getReply(keyword, page, createHTML.showList) // 위 사양으로 댓글 목록을 다시 불러옴
}

// 검색창에 값이 입력됨에 따라 취소 or 검색 버튼 표시
inputField.addEventListener("input", handleInputChange);

// 취소 버튼 클릭 시, 검색창 비우고 댓글 목록 다시 불러옴
cancelButton.addEventListener("click", handleCancelClick);

// 체크박스 클릭할 때 추가할 이벤트 함수
const checkboxEvent = () => {
    // 전체 선택 체크박스, 댓글 목록 각각의 체크박스
    const allCheck = document.querySelector(".all-check");
    const checkboxes = document.querySelectorAll(".checkbox-input");

    // 전체 선택 체크박스의 체크 상태(체크됨 or 안 됨)를 모든 체크박스에 똑같이 적용
    allCheck.addEventListener("change", function () {
        checkboxes.forEach(function (checkbox) {
            checkbox.checked = allCheck.checked;
        });
    });

    // 화면에 표시된 댓글 목록 내 체크박스들 중 하나라도 체크가 안 된 것이 있다면, 전체 선택 체크박스 체크 해제
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

    // 화면에 표시된 댓글 목록 내 체크박스들이 전부 체크된 상태라면, 전체 선택 체크박스 체크
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
