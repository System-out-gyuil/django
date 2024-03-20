const salesService = (()=>{

    const getList = async (page, callback) =>{
        const response = await fetch(`/member/mypage/show/trades/${page}`);
        const trades = await response.json();
        if (callback){
            return callback(trades)
        }
        return trades

    };

    return {getList:getList}
})()