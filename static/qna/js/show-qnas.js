// QnA 목록을 화면에 띄우는 함수
const showQnAs = (qnas) => {
    // 화면에 뿌릴 HTML 코드를 담기 위한 빈 문자열
    let text = ``

    // 조회한 데이터 중 QnA 리스트만 가져옴
    let pageInfo = qnas.pop();

    // 각 QnA를 HTML 코드에 담아 text 변수에 추가
    qnas.forEach((qna) => {
        text += `
            <li class="list-inner-box">
              <h3 class="list-inner">
                <button class="list-q">
                  <span class="question-q">Q</span>
                  <span class="question-text">${qna.qna_title}</span>
                  <span class="question-v"></span>
                </button>
              </h3>
              <div class="question">
                <p>
                  ${qna.qna_content}
                </p>
              </div>
            </li>
        `;
    });

    // 완성된 문자열 반환
    return text;
}