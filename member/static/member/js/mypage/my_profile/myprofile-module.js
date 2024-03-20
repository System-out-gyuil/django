const postService = (()=>{

    const allPostList = async (page, callback) =>{
        console.log('모든 리스트 가져오기')
        const response = await fetch(`/member/mypage/show/${page}`);
        const posts = await response.json();
        console.log(posts)
        if (callback){
            return callback(posts)
        }
        return posts

    };

    const getList = async (page, callback) =>{
        console.log('리스트 가져오기')
        const response = await fetch(`/member/mypage/show/posts/${page}`);
        const posts = await response.json();
        if (callback){
            return callback(posts)
        }
        return posts

    };

    const getReplies = async (page, callback)=>{
        const response = await fetch(`/member/mypage/show/replies/${page}`);
        const replies = await response.json();
        if (callback){
            return callback(replies)
        }
        return replies

    };

        const getReviews = async (page, callback)=>{
        console.log('댓글 가져오기')
        const response = await fetch(`/member/mypage/show/reviews/${page}`);
        const reviews = await response.json();
        if (callback){
            return callback(reviews)
        }
        return reviews

    };
       const getScrapLectures = async (page, callback)=>{
        const response = await fetch(`/member/mypage/show/scraplectures/${page}`);
        const scrap_lectures = await response.json();
        if (callback){
            return callback(scrap_lectures)
        }
        return scrap_lectures

    };


       const getScrapTrades = async (page, callback)=>{
        const response = await fetch(`/member/mypage/show/scraptrades/${page}`);
        const scrap_trades = await response.json();
        if (callback){
            return callback(scrap_trades)
        }
        return scrap_trades

    };

      const getLikes = async (page, callback)=>{
        const response = await fetch(`/member/mypage/show/likes/${page}`);
        const likes = await response.json();
        if (callback){
            return callback(likes)
        }
        return likes

    };

    const removeLike = async (id, checker) => {
        await fetch(`/member/mypage/delete-likes/${checker}/${id}`, {
            method: 'delete',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    return {
        getList:getList,
        allPostList:allPostList,
        getReplies:getReplies,
        getReviews:getReviews,
        getLikes:getLikes,
        removeLike:removeLike,
        getScrapLectures:getScrapLectures,
        getScrapTrades:getScrapTrades
    }
})()