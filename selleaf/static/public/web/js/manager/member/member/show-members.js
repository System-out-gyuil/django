// 회원 목록을 화면에 띄우는 함수
const showMembers = (members_info) => {
    // HTML 코드를 담기 위한 빈 문자열
    let text = ``;

    // 받아온 데이터들 중 'members' 만 따로 가져옴
    const members = members_info.members;

    // 받아온 회원 정보로 화면에 뿌릴 HTML 태그 생성
    members.forEach((member) => {
        // 회원의 가입 유형에 따라 서로 다른 문자열을 변수에 할당
        const memberType = member.member_type === "google"
                                  ? '구글'
                                  : member.member_type === "kakao"
                                  ? '카카오'
                                  : member.member_type === "naver"
                                  ? '네이버'
                                  : false;

        // 회원의 휴면 여부에 따라 서로 다른 문자열을 변수에 할당
        const memberStatus = member.member_status ? '휴면' : '비휴면';

        text += `
                  <li class="list-content ${member.id}">
                    <input type="checkbox" class="checkbox-input" />
                    <a class="member-info-wrap">
                      <div class="member-info">${member.member_name}</div>
                        <div class="member-info">${member.member_email}</div>
                        <div class="member-info">${member.member_address}</div>
                        <div class="member-info">${memberType}</div>
                        <div class="member-info">10,000</div>
                        <div class="member-info">${memberStatus}</div>
                    </a>
                  </li>
        `;
    });

    // 완성된 HTML 코드 반환
    return text;
}