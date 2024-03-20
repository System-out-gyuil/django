// 다른 파일에서 memberService.메소드명 형식으로 사용할 수 있도록 모듈화
const memberService = (() => {
    // 회원 목록 조회 - 한 번에 10명씩
    const getList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/member-list/?keyword=${keyword}&page=${page}`);
        const members = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(members);
        }

        // 콜백함수를 받지 않았다면 데이터만 반한
        return members;
    }

    // 회원 여러 명을 휴면 상태로 변경
    const deleteMembers = async (memberIds) => {
        await fetch(`/admin/member/delete/${memberIds}`, {
            method: 'PATCH',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 객체형태로 반환 - memberService.getList() 형태로 사용 가능
    return {getList: getList, deleteMembers: deleteMembers}
})();