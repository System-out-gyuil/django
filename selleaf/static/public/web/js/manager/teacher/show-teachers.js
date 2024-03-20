// 강사 or 신청자 목록을 화면에 띄워주는 함수
const showTeachers = (teacher_info) => {
    // 아래의 로직으로 완성된 HTMl 코드를 담기 위한 빈 문자열
    let text = ``;

    // API 요청으로 받아온 데이터 중 'teachers' 만 가져와서 변수에 할당
    const teachers = teacher_info.teachers;

    // 강사 or 신청자 각각의 정보를 HTML 코드에 담음
    teachers.forEach((teacher) => {
        text += `
                  <li class="list-content ${teacher.id}">
                    <input type="checkbox" class="checkbox-input" />
                    <a class="teacher-info-wrap">
                      <div class="teacher-info">${teacher.teacher_name}</div>
                        <div class="teacher-info">${teacher.teacher_info}</div>
                        <div class="teacher-info">${teacher.lecture_plan}</div>
                        <div class="teacher-info">${teacher.created_date}</div>
                    </a>
                  </li>
        `;
    });

    // 완성된 HTML 코드 반환
    return text;
}