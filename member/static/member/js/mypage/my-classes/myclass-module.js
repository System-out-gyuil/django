const classService = (()=> {

    const classList = async (page, callback) => {
        const response = await fetch(`/member/mypage/show/teachers/${page}`);
        const applies = await response.json();
        if (callback) {
            return callback(applies)
        };
        return applies

    };

    const traineeList = async (applyID, callback) =>{
        const response = await fetch(`/member/mypage/teachers/show/apply/${applyID}`);
        const apply = await response.json();
        if(callback){
            return callback(apply)
        };
        return apply
    }

    return {classList:classList, traineeList:traineeList}
})()