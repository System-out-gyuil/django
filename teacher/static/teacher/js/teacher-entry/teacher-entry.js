// 강사 신청 - 안내 페이지 js 파일

/*  
    ※ 자주 묻는 질문

    각 질문 제목 or 옆에 있는 버튼 클릭 시
    답변 펼쳐짐(height 100%) + 버튼 180도 회전 

    펼쳐진 상태로 다시 클릭하면 닫히게
*/
let page = 1
let keyword = ''
const listSection = document.querySelector('.list-section')

// QnA 목록을 화면에 띄우는 함수
const showQnAs = (qna_info) => {
    // 화면에 뿌릴 HTML 코드를 담기 위한 빈 문자열
    let text = ``

    // 조회한 데이터 중 QnA 리스트만 가져옴
    qnas = qna_info.qnas;

    // 각 QnA를 HTML 코드에 담아 text 변수에 추가
    qnas.forEach((qna) => {
        text += `
            <div class="each-questions-wrap">
              <div class="question-title-wrap">
                ${ qna.qna_title }
                <span class="expansion-button-wrap">
                  <!-- JS - 클릭하면 답변 펼쳐짐 + 버튼 180도 회전 -->
                  <img
                    class="expansion-button"
                    src='/static/public/web/images/common/button-down.png'
                  />
                </span>
              </div>
              <!-- 답변 - 평소에는 height 0 -->
              <div class="answer-wrap">
                <div class="answer-container">
                  ${qna.qna_content}
                </div>
              </div>
            </div>
        `;
    });

    // 완성된 문자열 반환
    return text;
}

const nextQnAs = () => {
    // 햔재 스크롤 위치와 리스트 부분의 현재 높이
    let currentscroll = document.documentElement.scrollTop;
    let listHeight = listSection.clientHeight;

    if (currentscroll >= listHeight) {
        qnaService.getList(keyword, ++page, showQnAs).then((qna) => {
            listSection.innerHTML += qna;

            addButtonEvent();
        });
    }
}

qnaService.getList(keyword, page, showQnAs).then((qna) => {
    listSection.innerHTML = qna;

    addButtonEvent();
});

window.addEventListener('scroll', nextQnAs);


const addButtonEvent = () => {
    // 객체(질문 사항들) 전부 가져오기
    const questions = document.querySelectorAll(".each-questions-wrap");

    // 각 객체에 click 이벤트 추가
    questions.forEach((item) => {
        // 질문 제목칸 객체 가져오기
        const questionTitle = item.children[0];

        // 이벤트의 대상이 될 답변과 확장버튼 역시 변수에 할당
        const answer = item.children[1];
        const expandButton = item.children[0].children[0].children[0];

        // 제목칸 - click 이벤트
        questionTitle.addEventListener("click", () => {
            // 현재 답변칸 height에 따라 0 or 실제 객체 높이(px)만큼의 크기 부여(.open 추가)
            answer.classList.contains("open")
                ? answer.classList.remove("open")
                : answer.classList.add("open");

            // 확장 버튼 180도 회전
            expandButton.style.transform =
                expandButton.style.transform === "rotate(180deg)"
                    ? "rotate(0deg)"
                    : "rotate(180deg)";
        });
    });
}

// /*
//   모달창 관련 코드 - from 결제 페이지
// */
// // 강사신청 모달, 모달 표시 버튼(2개) 가져오기
// const entryModal = document.querySelector(".entry-modal-wrap");
// const modalBtn = document.querySelectorAll(".header-entry-button, .entry-link");
//
// // 강사신청 모달창 표시
// modalBtn.forEach((button) => {
//     // button.preventDefault;
//
//     button.addEventListener("click", () => {
//         entryModal.style.display = "block";
//     });
// });
//
// // 강사신청 모달창 내 닫기 버튼
// const closeBtn = document.querySelector(".close-button");
//
// // 클릭하면 강사신청 모달창 닫힘
// closeBtn.addEventListener("click", () => {
//     entryModal.style.display = "none";
// });
//
// /*
//   이메일, 비밀번호 검사 및 에러 처리
// */
// // 이메일, 비밀번호 입력창
// // const emailInput = document.querySelector(".local-input-form");
// const passwordInput = document.querySelector(".password-input-form");
//
// // 각 입력창 아래 숨겨져 있는, 에러 텍스트가 표시되는 부분
// // const emailErrorText = document.querySelector(".email-input-area .error-text");
// const passwordErrorText = document.querySelector(
//     ".password-input-area .error-text"
// );
//
// // 상황별 에러 텍스트
// const mustNeededMsg = "필수 입력 사항입니다.";
//
// const tooShortMsg = "8자리 이상 입력해주세요";
// const tooLongMsg = "15자리 이하로 입력해주세요";
//
// // 비밀번호 양식
// const passwordRegex = /^[A-Za-z0-9]{8,15}$/;
//
// // // 이메일 입력창 - keyup 이벤트
// // emailInput.addEventListener("keyup", (e) => {
// //   // 값이 없다면 입력창에 에러 발생
// //   if (!e.target.value) {
// //     // error 클래스가 기존에 없었을 경우에만 추가
// //     if (!emailInput.classList.contains("error")) {
// //       emailInput.classList.add("error");
// //     }
//
// //     // 숨겨져 있던 에러 텍스트 표시
// //     emailErrorText.style.display = "block";
//
// //     // 아래쪽 이벤트 실행 안하고 이벤트 리스너 탈출
// //     return;
// //   }
// //   // 입력값이 뭐라도 있다면 입력창 error 클래스 제거
// //   emailInput.classList.remove("error");
//
// //   // 에러 텍스트 숨김
// //   emailErrorText.style.display = "none";
// // });
//
// // // 이메일 입력창 - blur 이벤트
// // // keyup 이벤트와 기능 동일
// // emailInput.addEventListener("blur", (e) => {
// //   if (!e.target.value) {
// //     if (!emailInput.classList.contains("error")) {
// //       emailInput.classList.add("error");
// //     }
// //     emailErrorText.style.display = "block";
//
// //     return;
// //   }
// //   emailInput.classList.remove("error");
// //   emailErrorText.style.display = "none";
// // });
//
// /*
//   비밀번호 입력창 - keyup 이벤트
//
//   값이 없거나, 입력 양식이 틀렸다면 error 발생 - if문 안으로 이동
// */
// passwordInput.addEventListener("keyup", (e) => {
//     if (!e.target.value || !passwordRegex.test(e.target.value)) {
//         // input 창에 빨간 테두리 추가
//         if (!passwordInput.classList.contains("error")) {
//             passwordInput.classList.add("error");
//         }
//
//         // input 창 아래에 에러 텍스트 표시
//         passwordErrorText.style.display = "block";
//
//         /*
//           분기 처리
//
//           값 없음 - "필수 입력"
//
//           값 있음, 8자 이하 - "8자 이상"
//           값 있음, 8자 이상, 15자 이하 - "15자 이하"
//         */
//         passwordErrorText.innerText = !e.target.value
//             ? mustNeededMsg
//             : e.target.value.length < 8
//                 ? tooShortMsg
//                 : e.target.value.length > 15
//                     ? tooLongMsg
//                     : false;
//
//         return;
//     }
//     // 테두리 색상 원복, 에러 텍스트 숨김
//     passwordInput.classList.remove("error");
//     passwordErrorText.style.display = "none";
// });
//
// // 비밀번호 입력창 - blur 이벤트
// passwordInput.addEventListener("blur", (e) => {
//     if (!e.target.value || !passwordRegex.test(e.target.value)) {
//         if (!passwordInput.classList.contains("error")) {
//             passwordInput.classList.add("error");
//         }
//
//         passwordErrorText.style.display = "block";
//
//         passwordErrorText.innerText = !e.target.value
//             ? mustNeededMsg
//             : e.target.value.length < 2
//                 ? tooShortMsg
//                 : e.target.value.length > 15
//                     ? tooLongMsg
//                     : false;
//
//         return;
//     }
//     passwordInput.classList.remove("error");
//     passwordErrorText.style.display = "none";
// });
//
// /*
//   신청 버튼 클릭한 시점에 DB에서 해당 회원의 비밀번호를 조회
//
//   불러온 비밀번호와 불일치 시,
//   비밀번호 입력창 테두리 빨간색으로 변경 + "틀렸습니다" 오류 메세지 표시
//
//   일치할 경우, 별도의 신청 사이트로 이동
// */
//
// // 강사신청 모달 내 신청버튼
// const entryButton = document.querySelector(".entry-button");
//
// // DB에서 조회한 결과와 불일치 시 띄울 에러 메세지
// const invalidMsg = "비밀번호가 틀렸습니다.";
//
// // 올바른 비밀번호(임시) - 나중에는 DB에 select 쿼리 보내도록 하기
// const correctPW = "12345678";
//
// entryButton.addEventListener("click", () => {
//     if (passwordInput.value !== correctPW) {
//         if (!passwordInput.classList.contains("error")) {
//             passwordInput.classList.add("error");
//         }
//
//         passwordErrorText.style.display = "block";
//
//         passwordErrorText.innerText = invalidMsg;
//
//         return;
//     }
//     // 비밀번호 일치 시 모달창 닫힘
//     entryModal.style.display = "none";
//
//     // 나중에는 강사 신청(정보 입력) 페이지로 연결
// });

// 2/19 추가 - 무한 반복 슬라이드 배너
function infinite() {
    const imgSlide = document.querySelector(".main-secondcontanier-imgwraplist");
    // 복제
    const clone = imgSlide.cloneNode(true);

    // 복제본 추가
    document.querySelector(".main-secondcontanier-imgwrap").appendChild(clone);

    // 원본, 복제본 위치 지정
    document.querySelector(".main-secondcontanier-imgwraplist").offsetWidth +
    "px";

    // 클래스 할당
    imgSlide.classList.add("original");
    clone.classList.add("clone");
}

infinite();

const origin1 = document.querySelector(
    ".main-secondcontanier-imgwraplist.original"
);
const clone1 = document.querySelector(
    ".main-secondcontanier-imgwraplist.clone"
);

const ocdiv = document.querySelector(".main-secondcontanier");
const infiniteDiv = document.querySelector(".main-secondcontanier-wrap");

infiniteDiv.addEventListener("mouseenter", () => {
    origin1.style.animationPlayState = "paused";
    clone1.style.animationPlayState = "paused";
});

infiniteDiv.addEventListener("mouseleave", () => {
    origin1.style.animation =
        "50s linear 0s infinite normal forwards running slide01";
    clone1.style.animation = "50s linear 0s infinite normal none running slide02";
});

// 강사인지 아닌지에 따라 버튼의 내용과 링크를 바뀌게 함
const checkBtn = document.querySelector('.entry-link-wrap')
const teacherLetter = document.querySelector('.entry-title')
const buttonLetter = document.querySelector('.entry-link')

if(teacher_check==='True'){
    teacherLetter.innerText = 'Selleaf와 함께 새로운 강의를 시작해보세요!'
    buttonLetter.href = '/lecture/main'
    buttonLetter.innerText = '강의 개설하기'
}
else if(teacher_check==='False'){
    teacherLetter.innerText = '지금 신청하고 수강생들과 만나보세요!'
    buttonLetter.href = '/teacher/sub'
    buttonLetter.innerText = '강사자격 신청하기'
}