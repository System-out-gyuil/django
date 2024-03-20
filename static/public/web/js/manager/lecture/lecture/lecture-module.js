// 다른 파일에서 lectureService.메소드명 형식으로 사용할 수 있도록 모듈화
const lectureService = (() => {
    // 강의 게시물 목록 조회 - 한 번에 10개씩
    const getList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/lecture-list/?keyword=${keyword}&page=${page}`);
        const lectures = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(lectures);
        }

        // 콜백함수를 받지 않았다면 데이터만 반한
        return lectures;
    }

    // 강의 여러 개 삭제
    const deleteLectures = async (lectureIds) => {
        await fetch(`/admin/lecture/delete/${lectureIds}`, {
            method: 'PATCH',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 강의 리뷰 리스트 조회 - 한 번에 10개씩
    const getReviews = async (lectureId, keyword, page, callback) => {
        const response = await fetch(`/admin/lecture/review-list/?lectureId=${lectureId}&keyword=${keyword}&page=${page}`);
        const reviews = await response.json();

        if (callback) {
            return callback(reviews);
        }

        return reviews;
    }

    // 리뷰 여러 개 삭제 - delete
    const deleteReviews = async (lectureIds) => {
        await fetch(`/admin/lecture/review/delete/${lectureIds}`, {
            method: 'delete',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 강의 수강생 리스트 조회 - 한 번에 10명씩
    const getTrainees = async (lectureId, keyword, page, callback) => {
        const response = await fetch(`/admin/lecture/trainees-list/?lectureId=${lectureId}&keyword=${keyword}&page=${page}`);
        const trainees = await response.json();

        if (callback) {
            return callback(trainees);
        }

        return trainees;
    }

    // 객체형태로 반환 - lectureService.getList() 형태로 사용 가능
    return {
        getList: getList,
        deleteLectures: deleteLectures,
        getReviews: getReviews,
        deleteReviews: deleteReviews,
        getTrainees: getTrainees
    }
})();