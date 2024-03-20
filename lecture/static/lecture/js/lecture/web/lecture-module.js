const lectureService = (() => {

    const getList = async (page, filters, sorting, type, callback) => {
        const response = await fetch(`/lecture/total/${page}/${filters}/${sorting}/${type}`);
        const lectures = await response.json();
        if(callback){
            return callback(lectures);
        }
        return lectures;
    }

    const localList = async (page, callback) => {
        const response = await fetch(`/lecture/main/${page}`);
        const lectures = await response.json();
        if(callback){
            return callback(lectures);
        }
        return lectures;
    }

    return {getList: getList, localList:localList}

})();


const lectureScrapService = (() => {
  const update = async (lectureId) => {
    await fetch(`/lecture-scrap/api/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      },
      body: JSON.stringify({'lecture_id': lectureId})
    });
  }

  return {update: update}
})()

const scrapCountService = (() => {
    const scrapCount = async (lecture_id, callback) => {
        // let endpoint = "";
        // if (onlineStatus) {
        //     endpoint = `/lecture/detail/online?id=${lecture_id}`;
        // } else {
        //     endpoint = `/lecture/detail/offline?id=${lecture_id}`;
        // }

        const response = await fetch(`/lecture/detail/offline/${lecture_id}`);
        const lectures = await response.json();
        if(callback){
            return callback(lectures);
        }
        return lectures;
    }

    return {scrapCount: scrapCount}
})();