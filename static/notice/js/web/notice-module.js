// 다른 파일에서 noticeService.메소드명 형식으로 사용할 수 있도록 모듈화
const noticeService = (() => {
    // 공지사항 목록 조회
    // 데이터 조회만 실행하며, 콜백 함수를 인자로 받았다면 해당 함수에 이후 처리를 넘김
    const getList = async (keyword, page, callback) => {
        // 공지사항 API에 비동기로 데이터 요청해서 받아옴
        const response = await fetch(`/notice/list/?keyword=${keyword}&page=${page}`);
        const notices = await response.json();

        // 콜백 함수를 인자로 받았다면, 해당 함수에게 조회한 데이터를 인자로 넘김
        if (callback) {
            return callback(notices);
        }

        // 콜백 함수를 따로 받지 않았다면 데이터 값만 반환
        return notices;
    }

    // 공지사항 여러 개 삭제(소프트 딜리트)
    const deleteNotices = async (noticeIds) => {
        await fetch(`/admin/notice/delete/${noticeIds}`, {
            method: 'PATCH',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 객체 형태로 반환함으로서, noticeService.getList() 형식으로 getList 함수 사용 가능
    return {getList: getList, deleteNotices: deleteNotices}
})();