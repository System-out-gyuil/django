// 다른 파일에서 qnaService.메소드명 형식으로 사용할 수 있도록 모듈화
const qnaService = (() => {
    // QnA 목록 조회
    // 데이터 조회만 실행하며, 콜백 함수를 인자로 받았다면 해당 함수에 이후 처리를 넘김
    const getList = async (keyword, page, callback) => {
        // QnA API에 비동기로 데이터 요청해서 받아옴
        const response = await fetch(`/qna/list/?keyword=${keyword}&page=${page}`);
        const qnas = await response.json();

        // 콜백 함수를 인자로 받았다면, 해당 함수에게 조회한 데이터를 인자로 넘김
        if (callback) {
            return callback(qnas);
        }

        // 콜백 함수를 따로 받지 않았다면 데이터 값만 반환
        return qnas;
    }

    // QnA 여러 개 삭제(소프트 딜리트)
    const deleteQnAs = async (qnaIds) => {
        await fetch(`/admin/qna/delete/${qnaIds}`, {
            method: 'PATCH',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 객체 형태로 반환함으로서, qnaService.getList() 형식으로 getList 함수 사용 가능
    return {getList: getList, deleteQnAs: deleteQnAs}
})();