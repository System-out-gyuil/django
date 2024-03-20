// 다른 파일에서 postService.메소드명 형식으로 사용할 수 있도록 모듈화
const postService = (() => {
    // 커뮤니티 게시물 목록 조회 - 한 번에 10개씩
    const getPostsList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/posts/posts-list/?keyword=${keyword}&page=${page}`);
        const posts = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(posts);
        }

        // 콜백함수를 받지 않았다면 데이터만 반한
        return posts;
    }

    // 노하우 게시물 목록 조회 - 한 번에 10개씩
    const getKnowhowList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/posts/knowhow-list/?keyword=${keyword}&page=${page}`);
        const posts = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(posts);
        }

        // 콜백함수를 받지 않았다면 데이터만 반한
        return posts;
    }

    // 거래 게시물 목록 조회 - 한 번에 10개씩
    const getTradeList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/posts/trade-list/?keyword=${keyword}&page=${page}`);
        const posts = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(posts);
        }

        // 콜백함수를 받지 않았다면 데이터만 반한
        return posts;
    }

    // 커뮤니티 게시물 여러 개 삭제
    const deletePosts = async (postIds) => {
        await fetch(`/admin/posts/posts-delete/${postIds}`, {
            method: 'delete',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 노하우 게시물 여러 개 삭제
    const deleteKnowhows = async (knowhowIds) => {
        await fetch(`/admin/posts/knowhow-delete/${knowhowIds}`, {
            method: 'delete',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 거래 게시물 여러 개 삭제(소프트 딜리트)
    const deleteTrades = async (tradeIds) => {
        await fetch(`/admin/posts/trade-delete/${tradeIds}`, {
            method: 'PATCH',
            headers: {'X-CSRFToken': csrf_token}
        });
    }

    // 커뮤니티 게시물 개수 세기
    const countPosts = async () => {
        const response = await fetch(`/admin/posts/posts-count/`);
        const postCount = await response.json();

        return postCount;
    }

    // 커뮤니티 게시물 개수 세기
    const countKnowhows = async () => {
        const response = await fetch(`/admin/posts/knowhow-count/`);
        const knowhowCount = await response.json();

        return knowhowCount;
    }

    // 커뮤니티 게시물 개수 세기
    const countTrades = async () => {
        const response = await fetch(`/admin/posts/trade-count/`);
        const tradeCount = await response.json();

        return tradeCount;
    }

    // 모듈 반환
    return {
        getPostsList: getPostsList,
        getKnowhowList: getKnowhowList,
        getTradeList: getTradeList,
        deletePosts: deletePosts,
        deleteKnowhows: deleteKnowhows,
        deleteTrades: deleteTrades,
        countPosts: countPosts,
        countKnowhows: countKnowhows,
        countTrades: countTrades
    }
})();