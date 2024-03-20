// 공지사항 목록을 화면에 띄우는 함수
const showNotices = (notices) => {
    // 화면에 뿌릴 HTML 코드를 담기 위한 빈 문자열
    let text = ``

    // 조회한 데이터 중 공지사항만 가져옴
    // 이렇게 안 하면 hasNext가 섞여 들어와서 배열이 아닌 객체가 되기 때문
    let pageInfo = notices.pop();

    // 각 공지사항을 HTML 코드에 담아 text 변수에 추가
    notices.forEach((notice) => {
        text += `
            <li class="list-inner-box">
              <h3 class="list-inner">
                <button class="list-q">
                  <span class="question-text">${notice.notice_title}</span>
                  <span class="question-v"></span>
                </button>
              </h3>
              <div class="question">
                <p>
                  ${notice.notice_content}
                </p>
              </div>
            </li>
        `;
    });

    // 완성된 문자열 반환
    return text;
}