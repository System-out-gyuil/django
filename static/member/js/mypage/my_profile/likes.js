// 마이페이지/프로필/노하우 js 파일

let page = 1;

const showLikeList = (likes) => {
  totalLikes = likes.length
  const likeCounts = document.querySelectorAll('.like-count')
  likeCounts.forEach((totalLike)=>{
    totalLike.innerText = totalLikes
  })
  let text = ``
  likes.forEach((like) => {
    if ('post_id' in like) {
      text += `
          <div class="post-container" id="post">
            <input type="hidden" class="post-id" name="post-id" value="${like.post_id}">
            <div class="post-inner">
              <article class="post">
                <a href="/post/detail/?id=${like.post_id}" class="post-link"></a>
                <div class="post-image-wrap_">
                  <div class="post-image-container">
                    <div class="post-image-inner">
                      <div class="post-image"></div>
                      <img
                        src="/upload/${like.post_file}"
                        alt=""
                        class="image"
                      />
                      <img class="like-button" src="/static/public/web/images/common/like-on.png" />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
          `;
    }else  if('knowhow_id' in like) {
      text += `
          <div class="post-container" id="knowhow">
            <input type="hidden" class="knowhow-id" name="post-id" value="${like.knowhow_id}">
            <div class="post-inner">
              <article class="post">
                <a href="/knowhow/detail/?id=${like.knowhow_id}" class="post-link"></a>
                <div class="post-image-wrap_">
                  <div class="post-image-container">
                    <div class="post-image-inner">
                      <div class="post-image"></div>
                      <img
                        src="/upload/${like.knowhow_file}"
                        alt=""
                        class="image"
                      />
                      <img class="like-button" src="/static/public/web/images/common/like-on.png" />
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
          `;
    }
  });
  return text
};

const wrap = document.querySelector('.post-wrap')



wrap.addEventListener('click', async (e) => {
  if (e.target.classList[0] === 'like-button') {
    e.target.classList.toggle('clicked');
    const container = e.target.closest(".post-container");
    if (container.id === 'post') {
      const id = container.querySelector('.post-id').value;
      await postService.removeLike(id, 'post');
    } else if (container.id === 'knowhow') {
      const id = container.querySelector('.knowhow-id').value;
      await postService.removeLike(id, 'knowhow');
    }
    page = 1
    // 좋아요를 추가 또는 삭제한 후에는 페이지 번호를 유지하고 좋아요 목록을 다시 가져오기
    const updatedText = await postService.getLikes(page, showLikeList);
    wrap.innerHTML = updatedText;
  }
});

postService.getLikes(page++,showLikeList).then((text)=>{
  wrap.innerHTML += text
})

window.addEventListener("scroll", async() => {
    // 맨위
    const scrollTop = document.documentElement.scrollTop;
    // 페이지 높이
    const windowHeight = window.innerHeight;
    // 암튼 높이
    const totalHeight = document.documentElement.scrollHeight;
    // 전체 높이에서 내가 보는 스크롤이 total보다 크면 추가

    if (scrollTop + windowHeight >= totalHeight) {
      page++
      const text = await postService.getLikes(page,showLikeList)
        wrap.innerHTML += text
    }
});

