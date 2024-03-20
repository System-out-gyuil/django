// 전체 선택 체크박스, 승인, 삭제 버튼
const allCheckBox = document.querySelector(".all-check");
const deleteBtn = document.querySelector(".delete-button");
const approveBtn = document.querySelector(".edit-button");

// 현재 체크된 박스의 개수를 세는 함수
const countCheckBoxes = () => {
  // 각 체크박스의 상태가 변할 때마다 체크된 박스의 개수를 셈
  const checkedBoxes = document.querySelectorAll("input[type='checkbox']:checked")

  // 체크된 박스가 하나라도 있다고 가정하고 삭제 버튼의 disabled 해제
  deleteBtn.disabled = false;
  approveBtn.disabled = false;

  // 체크된 박스가 하나도 없다면 삭제 버튼 비활성화, 전체 선택 체크 해제
  if (checkedBoxes.length === 0) {
    deleteBtn.disabled = true;
    approveBtn.disabled = true;
  }
}

// 페이지가 열렸을 때 체크된 박스 개수를 셈
countCheckBoxes();

// 체크박스 이벤트 추가 기능 함수화
const addCheckBoxEvent = () => {
  // 체크박스 관련 js
  const allCheck = document.querySelector(".all-check");
  const checkboxes = document.querySelectorAll(".checkbox-input");

  // all-check 체크 여부에 따라 checkbox-input 체크 여부 조절
  allCheck.addEventListener("change", function () {
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = allCheck.checked;

      // 현재 체크된 박스 개수를 세서 삭제 버튼의 활성화 여부 조정
      countCheckBoxes();
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

  // 체크박스의 체크 상태가 변할 때마다 체크된 박스 개수를 셈
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", countCheckBoxes);
  });
}

// 페이지네이션 버튼 클릭 시 발생하는 이벤트 추가하는 함수 - 페이지네이션 dict 데이터 가져와서 키로 접근
const addPaginationEvent = (pageInfo) => {
    // 앞으로 가기, 뒤로 가기 버튼, 숫자 페이지 버튼, 페이지 수 표시되는 span 태그
    const pageCountPrev = document.querySelector(".page-count-prev");
    const pageCountNext = document.querySelector(".page-count-next");
    const pageCountNumBtns = document.querySelectorAll("button.page-count-num");
    const pageCountNumSpans = document.querySelectorAll("span.page-count-num");

    // 현재 페이지(받아온 dict 데이터의 page)가 1보다 클 때
    if (pageInfo.page > 1) {
        // 뒤로 가기 버튼 클릭 이벤트 추가 - 이전 페이지의 데이터 요청(키워드는 그대로 유지)
        pageCountPrev.addEventListener("click", async () => {
            await reportService.getKnowhowReplyReports(keyword, --page, createHTML.showList);
        });
    }

    // 현재 페이지가 맨 끝 페이지가 아닐 때
    if (pageInfo.page !== pageInfo.realEnd){
        // 앞으로 가기 버튼 누르면 다음 페이지 데이터 요청
        pageCountNext.addEventListener("click", async () => {
            await reportService.getKnowhowReplyReports(keyword, ++page, createHTML.showList);
        });
    }

    // 페이지 숫자 버튼 각각에 클릭 이벤트 추가
    pageCountNumBtns.forEach((btn, i) => {
        // 버튼 클릭 시 해당 버튼 안 숫자를 가져와서 page에 할당 -> 해당 페이지의 데이터 요청
        btn.addEventListener("click", async () => {
            page = pageCountNumSpans[i].innerText;
            await reportService.getKnowhowReplyReports(keyword, page, createHTML.showList);
        });
    });
}

// 받아온 신고 사항들을 뿌려주는 함수
// 전체 신고 수 표시할 태그, 신고 내역 리스트 뿌릴 태그, 페이지 버튼 감싸는 태그
const allNum = document.querySelector(".all-num")
const listContent = document.querySelector(".list-content")
const pageCountWrap = document.querySelector(".page-count-wrap")

// HTML 코드 생성 모듈
const createHTML = (() => {
    // 신고 내역 리스트 표시 - API 요청 데이터 전체(신고 내역 정보+페이지네이션 변수, 배열)를 인자로 받음
    const showList = async (reports) => {
        // HTML 코드를 담을 빈 문자열
        let text = ``;
        // 페이지네이션+전체 신고 내역 수를 담은 dict 데이터를 배열에서 분리해서 pageInfo에 할당
        let pageInfo = reports.pop()
        // 받아온 dict 데이터에서 전체 신고 내역 수를 화면에 표시
        allNum.innerText = pageInfo.totalCount

        reportLecutres.innerText = pageInfo.lectureReports;
        reportTrades.innerText = pageInfo.tradeReports;
        reportPosts.innerText = pageInfo.postReports;
        reportPostReplies.innerText = pageInfo.postReplyReports;
        reportKnowhows.innerText = pageInfo.knowhowReports;
        reportKnowhowReplies.innerText = pageInfo.knowhowReplyReports;

        // 신고 내역 정보가 없으면 내역 없음 표시
        if (reports.length === 0){
            text += `
                <div class="nothing">
                    <img src="/static/public/web/images/manager/nothing.png" class="nothing"/>
                    <p class="nothing">신고 내역이 없습니다.</p>
                </div>
            `
        }
        // 신고 내역이 하나라도 있다면 아래 코드로 신고 내역 리스트 생성
        else {
            // 신고 내역 각각을 HTML 코드에 담아서 text에 추가
            for (let report of reports){
                let reportStatus = ''

                if (report.report_status) {
                    reportStatus = '접수됨'
                }
                else {
                    reportStatus = "처리됨"
                }

                text += `
                    <li class="list-content ${report.id}">
                    <input type="checkbox" class="checkbox-input" />
                    <div class="report-info-wrap">
                      <div class="report-info">${report.report_target}</div>
                      <div class="report-info">${report.report_content}</div>
                      <div class="report-info">${report.report_member}</div>
                      <div class="report-info">${reportStatus}</div>
                      <div class="report-info">${report.created_date}</div>
                    </div>
                  </li>
                `
            }
        }
        // 완성한 신고 내역 내역을 화면에 표시
        listContent.innerHTML = text;
        // 페이지네이션 변수들로 만든 페이지 버튼도 화면에 표시
        showPagination(pageInfo)
        // 체크박스 클릭 이벤트 추가
        addCheckBoxEvent();
    }

    // 전달받은 페이지 관련 정보를 통해 페이지네이션 버튼을 만들어주는 함수 - 페이지네이션 변수(dict)를 인자로 받음
    const showPagination = (pageInfo) => {
        const totalCount = pageInfo.totalCount; // 전체 신고 내역 수
        const startPage = pageInfo.startPage; // 한 번에 표시되는 페이지 숫자 버튼 중 맨 처음 페이지
        const endPage = pageInfo.endPage; // 한 번에 표시되는 페이지 숫자 버튼 중 맨 마지막 페이지
        const currentPage = pageInfo.page; // 요청받은 현재 페이지
        const realEnd = pageInfo.realEnd; // 신고 내역 리스트의 맨 마지막 페이지

        // 페이지네이션 HTML 코드를 담을 빈 문자열
        let text = ``;
        // 신고 내역이 하나도 없다면 페이지네이션 버튼 표시 안 함
        if (totalCount === 0) {
            text = ``;
        }
        // 신고 내역이 하나라도 있다면 아래 코드로 페이지네이션 버튼 추가
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

    // 신고 내역 내역 표시 기능만 반환 - 페이지네이션 버튼 표시도 같이 실행
    // 페이지네이션 버튼만 화면에 표시할 이유가 없기 때문
    return {showList: showList}
})()

// 노하우 게시물 댓글 신고 리스트의 첫 페이지를 화면에 띄워주는 함수
const callFirstKnowhowReplyReportsList = () => {
  reportService.getKnowhowReplyReports(keyword, page, createHTML.showList);
  allCheckBox.checked = false;
  deleteBtn.disabled = true;
  approveBtn.disabled = true;
}

// 첫 화면에 강의 신고 내역 표시
callFirstKnowhowReplyReportsList();

// 삭제 버튼 누르면 뜨는 모달창
document.addEventListener("DOMContentLoaded", function () {
  const deleteButtons = document.querySelectorAll(".delete-button");
  const deleteModalWrap = document.querySelector(".delete-modal-wrap");
  const approveModalWrap = document.querySelector(".approve-modal-wrap");

  deleteButtons.forEach(function (deleteButton) {
    deleteButton.addEventListener("click", (e) => {
      deleteModalWrap.style.display = "flex";
    });
  });

  // 모달창이 표시되었을 때 나오는 어두운 배경 태그
  const deleteModalBgcolor = document.querySelector(".delete-modal-bgcolor");

  // 모달창이 표시된 상태에서 배경 클릭 시 모달창 숨김
  deleteModalBgcolor.addEventListener("click", () => {
      deleteModalWrap.style.display = "none";
  });

  const cancelButton = document.querySelector(".modal-cancel button");
  const confirmButton = document.querySelector(".modal-confirm button");

  cancelButton.addEventListener("click", () => {
    deleteModalWrap.style.display = "none";
  });

  // 삭제 시 이벤트
  confirmButton.addEventListener("click", async () => {
    deleteModalWrap.style.display = "none";

    // 삭제할 신고 내역의 id를 담을 빈 문자열
    let deleteIds = ``;

    // 이 시점에서 체크된 박스 개수를 세고
    const checkedBoxes = document.querySelectorAll(".checkbox-input:checked");

    // 각 체크박스를 감싸는 li 태그의 id를 deleteIds에 추가
    checkedBoxes.forEach((checkbox) => {
      deleteIds += `,${checkbox.parentElement.classList[1]}`;
    });

    // 삭제할 신고 내역의 id를 삭제 API에 보냄
    await reportService.deleteKnowhowReplyReports(deleteIds);

    // 다시 리스트 요청 - 키워드는 유지
    reportService.getKnowhowReplyReports(keyword, page=1, createHTML.showList);
    allCheckBox.checked = false;
    deleteBtn.disabled = true;
    approveBtn.disabled = true;
  });

  // 신고 승인 모달
  approveBtn.addEventListener('click', () => {
    approveModalWrap.style.display = 'flex';
  });

  const approveCancelBtn = document.querySelector(".approve-modal-cancel button");
  const approveConfirmButton = document.querySelector(".approve-modal-confirm button");

  // 승인 모달 취소
  approveCancelBtn.addEventListener('click', () => {
    approveModalWrap.style.display = 'none';
  });

  // 승인 실행
  approveConfirmButton.addEventListener('click', async () => {
    approveModalWrap.style.display = 'none';

    // 승인할 신고 내역의 id를 담을 빈 문자열
    let approveIds = ``;

    // 이 시점에서 체크된 박스 개수를 세고
    const checkedBoxes = document.querySelectorAll(".checkbox-input:checked");

    // 각 체크박스를 감싸는 li 태그의 id를 approveIds에 추가
    checkedBoxes.forEach((checkbox) => {
      approveIds += `,${checkbox.parentElement.classList[1]}`;
    });

    // 승인할 신고 내역의 id를 API에 보내서 승인 처리
    await reportService.approveKnowhowReplyReports(approveIds);

    // 다시 리스트 요청 - 키워드와 페이지 모두 유지
    reportService.getKnowhowReplyReports(keyword, page, createHTML.showList);
    allCheckBox.checked = false;
    deleteBtn.disabled = true;
    approveBtn.disabled = true;
  });
});

// 검색창 눌렀을때 검색바에 아웃라인주기
const searchBar = document.querySelector("label.search-bar");

document.addEventListener("click", (e) => {
  if (e.target.closest("label.search-bar")) {
    searchBar.classList.add("search-bar-checked");
    return;
  }
  searchBar.classList.remove("search-bar-checked");
});

const inputField = document.querySelector(".search-bar input");
const cancelButton = document.querySelector(".search-bar .cancel-logo");
const searchButton = document.querySelector(".search-bar .search-logo");

// 검색창에 엔터 입력 시 키워드로 검색하여 페이지를 뿌려주는 이벤트
inputField.addEventListener("keyup", async (e) => {
    // 검색창 내에서 엔터 입력 시 아래 코드 실행
    if (e.keyCode === 13) {
        // 입력창 내 값을 keyword에 할당
        keyword = inputField.value
        // 페이지 값 1로 원복
        page = 1
        // 위의 keyword가 포함된 신고 리스트의 1페이지를 불러옴
        await reportService.getKnowhowReplyReports(keyword, page, createHTML.showList)
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
    inputField.value = ""; // 검색창 입력값 초기화
    cancelButton.style.display = "none"; // 취소 버튼 숨김
    searchButton.style.display = "flex"; // 검색 버튼 표시

    keyword = inputField.value // keyword는 현재 빈 문자열(검색 조건 없음)
    page = 1 // 페이지 1로 초기화
    await reportService.getKnowhowReplyReports(keyword, page, createHTML.showList) // 신고 목록을 다시 불러옴
}

// 입력 필드에 이벤트 리스너를 추가합니다.
inputField.addEventListener("input", handleInputChange);

// cancel-logo에 클릭 이벤트 리스너를 추가합니다.
cancelButton.addEventListener("click", handleCancelClick);
