// 개설된 강의 목록을 화면에 띄우는 함수
const showLectures = (lectures_info) => {
    // HTML 코드를 담기 위한 빈 문자열
    let text = ``;

    // 받아온 데이터들 중 'lectures' 만 따로 가져옴
    const lectures = lectures_info.lectures;


    // 수강료를 3자리 단위로 콤마(,)로 구분해주는 함수
    const priceFormat = (price) => {
        return new Intl.NumberFormat().format(price);
    }

    // 받아온 강의 정보로 화면에 뿌릴 HTML 태그 생성
    lectures.forEach((lecture) => {
        // 위 함수로 price에 3자리마다 콤마 붙임
        let formattedPrice = priceFormat(lecture.lecture_price);

        // 온라인 강의는 '온라인', 오프라인 강의는 주소 출력
        const lecturePlace = lecture.online_status
                                                  ? '온라인'
                                                  : lecture.lecture_place;

        text += `
                  <li class="list-content ${lecture.id}">
                    <input type="checkbox" class="checkbox-input" />
                    <a class="class-info-wrap" href="/admin/lecture/review/?id=${lecture.id}" target="_blank">
                      <div class="class-info title">
                          <p class="content-name">${lecture.lecture_title}</p>
                          <p class="content-name-detail">${lecture.lecture_content}</p>
                      </div>
                      <div class="class-info">${lecture.teacher_name}</div>
                      <div class="class-info">${lecture.total_trainees}명</div>
                      <div class="class-info">${lecture.lecture_headcount}명</div>
                      <div class="class-info">${formattedPrice}원</div>
                      <div class="class-info">${lecturePlace}</div>
                      <div class="class-info">${lecture.created_date}</div>
                    </a>
                  </li>
        `;
    });

    // 완성된 HTML 코드 반환
    return text;
}