// 강의 리뷰 목록을 화면에 띄우는 함수
const showTrainees = (trainees_info) => {
    // HTML 코드를 담기 위한 빈 문자열
    let text = ``;

    // 받아온 데이터들 중 'trainees' 만 따로 가져옴
    const trainees = trainees_info.trainees;

    // 받아온 리뷰 정보로 화면에 뿌릴 HTML 태그 생성
    trainees.forEach((trainee) => {
        // apply_status에 따라 서로 다른 문자열 출력
        const applyStatus = trainee.apply_status === 1
                                         ? '수강 완료'
                                         : trainee.apply_status === 0
                                         ? '신청 완료'
                                         : trainee.apply_status === -1
                                         ? '수강 취소' : false;

        text += `
                  <li class="list-content">
                    <input type="checkbox" class="checkbox-input" />
                    <div class="trainee-info-wrap">
                      <div class="trainee-info">${trainee.trainee_name}</div>
                      <div class="trainee-info">${trainee.main_applicant}</div>
                      <div class="trainee-info">${trainee.apply_date}</div>
                      <div class="trainee-info">${trainee.apply_time}</div>
                      <div class="trainee-info">${applyStatus}</div>
                      <div class="trainee-info">${trainee.purchase_date}</div>
                    </div>
                  </li>
        `;
    });

    // 완성된 HTML 코드 반환
    return text;
}