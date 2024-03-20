// 다른 파일에서 teacherService.메소드명 형식으로 사용할 수 있도록 모듈화
const teacherService = (() => {
    // 강사 목록 조회 - 한 번에 10명씩
    const getList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/teacher-list/?keyword=${keyword}&page=${page}`);
        const teachers = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(teachers);
        }

        // 콜백함수를 받지 않았다면 데이터만 반한
        return teachers;
    }

    // 강사 신청자 목록 조회 - 한 번에 10명씩
    const getEntryList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/teacher-entry-list/?keyword=${keyword}&page=${page}`);
        const teacherEntries = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(teacherEntries);
        }

        // 콜백함수를 받지 않았다면 데이터만 반한
        return teacherEntries;
    }

    // 강사 여러 명 승인
    const approveTeachers = async (teacherIds) => {
        await fetch(`/admin/teacher-approve/${teacherIds}`, {
            method: 'PATCH',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 강사 여러 명 차단
    const deleteTeachers = async (teacherIds) => {
        await fetch(`/admin/teacher-delete/${teacherIds}`, {
            method: 'PATCH',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 객체 형태로 반환 - teacherService.getList() 형태로 사용 가능
    return {getList: getList, getEntryList: getEntryList, approveTeachers: approveTeachers, deleteTeachers: deleteTeachers}
})();