const lectureService = (()=> {

    const lectureList = async (page, callback) => {
        const response = await fetch(`/member/mypage/show/lectures/${page}`);
        const lectures = await response.json();
        if (callback) {
            return callback(lectures)
        };
        return lectures

    };

    return {lectureList:lectureList}
})()