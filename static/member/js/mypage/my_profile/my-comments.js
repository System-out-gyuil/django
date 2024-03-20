// 마이페이지/프로필/노하우 js 파일


/* 
  각 댓글에 마우스 올린 경우 제목, 본문, 이미지 투명도 조정
*/

// 각 댓글
const commentsItems = document.querySelectorAll(".comments-history-item-wrap");

// 각 댓글에 mouseover, mouseout 이벤트 추가
commentsItems.forEach((item) => {
  // 각 댓글의 이미지, 제목, 본문을 변수화
  const itemImage = item.children[1].children[0];
  const itemTitle = item.children[1].children[1];
  const itemArticle = item.children[1].children[2];

  item.addEventListener("mouseover", () => {
    itemImage.style.opacity = 0.6;
    itemTitle.style.opacity = 0.6;
    itemArticle.style.opacity = 0.6;
  });

  item.addEventListener("mouseout", () => {
    itemImage.style.opacity = 1;
    itemTitle.style.opacity = 1;
    itemArticle.style.opacity = 1;
  });
});

let page = 1;

const showReplyList = (replies) => {
  let text = ``;

  replies.forEach((reply) => {
    let postPlantTags = ""; // postPlantTags 변수를 미리 정의하고 초기화
      if('post_id' in reply){
          const postLength = reply.post_plant.length;

          text += `
            <div class="comments-history-item-wrap">
              <a href="/post/detail/?id=${reply.post_id}" class="comments-history-link"></a>
              <div class="comments-history-item-container">
                <div class="comments-item-image-wrap" style="opacity: 1">
                  <img alt=""
                    class="comments-item-image"
                    src="/upload/${reply.post_file}"
                  />
                </div>
                <div class="comments-item-title-wrap" style="opacity: 1">
                  <span>${reply.post_title}</span>
                </div>
                <div class="comments-item-article-wrap" style="opacity: 1">
                  <span
                    >${reply.post_reply_content}</span
                  >
                </div>
                <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
                <div class="comments-item-info-wrap">
                  <div class="article-info-wrap">
                    <!-- 작성자 -->
                    <div class="user-info-wrap">
                      ${reply.post_writer}
                    </div>
                    <!-- 올린 시간, 조회수, 지역 -->
                    <div class="item-info-wrap">
                      <div class="item-infos">${timeForToday(reply.updated_date)}</div>
                      <div class="item-infos">조회 ${reply.post_count}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `
      }else if( 'knowhow_id' in reply){
          const postLength = reply.knowhow_plant.length;

          text += `
            <div class="comments-history-item-wrap">
              <a href="/knowhow/detail/?id=${reply.knowhow_id}" class="comments-history-link"></a>
              <div class="comments-history-item-container">
                <div class="comments-item-image-wrap" style="opacity: 1">
                  <img alt=""
                    class="comments-item-image"
                    src="/upload/${reply.knowhow_file}"
                  />
                </div>
                <div class="comments-item-title-wrap" style="opacity: 1">
                  <span>${reply.knowhow_title}</span>
                </div>
                <div class="comments-item-article-wrap" style="opacity: 1">
                  <span
                    >${reply.knowhow_reply_content}</span
                  >
                </div>
                <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
                <div class="comments-item-info-wrap">
                  <div class="article-info-wrap">
                    <!-- 작성자 -->
                    <div class="user-info-wrap">
                      ${reply.knowhow_writer}
                    </div>
                    <!-- 올린 시간, 조회수, 지역 -->
                    <div class="item-info-wrap">
                      <div class="item-infos">${timeForToday(reply.updated_date)}</div>
                      <div class="item-infos">조회 ${reply.knowhow_count}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `
      };
  });

  return text;
};

const target = document.querySelector('.here')
postService.getReplies(page++,showReplyList).then((text)=>{
  target.innerHTML += text
})


function timeForToday(datetime) {
    const today = new Date();
    const date = new Date(datetime);

    let gap = Math.floor((today.getTime() - date.getTime()) / 1000 / 60);

    if (gap < 1) {
        return "방금 전";
    }

    if (gap < 60) {
        return `${gap}분 전`;
    }

    gap = Math.floor(gap / 60);

    if (gap < 24) {
        return `${gap}시간 전`;
    }

    gap = Math.floor(gap / 24);

    if (gap < 31) {
        return `${gap}일 전`;
    }

    gap = Math.floor(gap / 31);

    if (gap < 12) {
        return `${gap}개월 전`;
    }

    gap = Math.floor(gap / 12);

    return `${gap}년 전`;
}


window.addEventListener("scroll", () => {
    // 맨위
    const scrollTop = document.documentElement.scrollTop;
    // 페이지 높이
    const windowHeight = window.innerHeight;
    // 암튼 높이
    const totalHeight = document.documentElement.scrollHeight;
    // 전체 높이에서 내가 보는 스크롤이 total보다 크면 추가

    if (scrollTop + windowHeight >= totalHeight) {
        postService.getReplies(page++,showReplyList).then((text)=>{
          target.innerHTML += text

        });
    }
});


