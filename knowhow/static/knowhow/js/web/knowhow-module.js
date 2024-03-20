const knowhowService = (() => {

    const getList = async (page, filters, sorting, types, callback) => {
        const response = await fetch(`/knowhow/list/${page}/${filters}/${sorting}/${types}`);
        const knowhows = await response.json();
        if(callback){
            return callback(knowhows);
        }
        return knowhows;
    }

    const getScrap = async (knowhow_id, member_id, scrap_status, callback) => {
        const response = await fetch(`/knowhow/like/scrap/${knowhow_id}/${member_id}/${scrap_status}/`);
        const scraps = await response.json();
        if (callback){
            return callback(scraps);
        }
        return scraps;

    }

    const getLike = async (knowhow_id, member_id, like_status, callback) => {
    const response = await fetch(`/knowhow/like/scrap/${knowhow_id}/${member_id}/${like_status}`);
    const likes = await response.json();
    if (callback){
        return callback(likes);
    }
    return likes;

    }


    return {getList: getList, getScrap: getScrap, getLike:getLike}
})();
