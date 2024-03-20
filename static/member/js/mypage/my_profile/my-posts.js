// // 마이페이지/프로필/사진 js 파일
//

let page = 1;

const showList = (posts) => {
  let text = ``
  posts.forEach((post) => {
      if('post_title' in post) {
      const postPlantTags = post.post_plant.map(plant => `<span class="post-tag-icon">${plant}</span>`).join('');

          text += `
            <div class="post-container">
              <div class="post-inner">
                <article class="post">
                  <a href="/post/detail/?id=${post.id}" class="post-link"></a>
                  <div class="post-image-wrap_">
                    <div class="post-image-container">
                      <div class="post-image-inner">
                        <div class="post-image"></div>
                        <img
                          src="/upload/${post.post_file}"
                          alt=""
                          class="image"
                        />
                        <div class="image__dark-overlay"></div>
                      </div>
                    </div>
                  </div>
                  <div class="post-contents-wrap">
                    <div class="post-contents-container">
                      <h1 class="post-contents-header">
                        <span class="post-contents-user">${post.member_name}</span>
                        <span class="post-contents-banner">${post.post_title}</span>
                      </h1>
                      <span class="post-price">
                        <span class="post-price-letter">${post.post_content}</span>
                      </span>
                      <div class="post-content-pc-reply">
                        <p class="post-content-reply">댓글 ${post.post_reply.length}</p>
                        <p class="post-content-scrap">조회수 ${post.post_count}</p>
                      </div>
                      <span class="post-tag">${postPlantTags}</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          `;
      }else if('knowhow_title' in post){
      const knowhowPlantTags = post.knowhow_plant.map(knowhow_plant => `<span class="post-tag-icon">${knowhow_plant}</span>`).join('');
          text += `
            <div class="post-container">
              <div class="post-inner">
                <article class="post">
                  <a href="/knowhow/detail/?id=${post.id}" class="post-link"></a>
                  <div class="post-image-wrap_">
                    <div class="post-image-container">
                      <div class="post-image-inner">
                        <div class="post-image"></div>
                        <img
                          src="/upload/${post.knowhow_file}"
                          alt=""
                          class="image"
                        />
                        <div class="image__dark-overlay"></div>
                      </div>
                    </div>
                  </div>
                  <div class="post-contents-wrap">
                    <div class="post-contents-container">
                      <h1 class="post-contents-header">
                        <span class="post-contents-user">${post.writer}</span>
                        <span class="post-contents-banner">${post.knowhow_title}</span>
                      </h1>
                      <span class="post-price">
                        <span class="post-price-letter">${post.knowhow_content}</span>
                      </span>
                      <div class="post-content-pc-reply">
                        <p class="post-content-reply">댓글 ${post.knowhow_reply.length}</p>
                        <p class="post-content-scrap">조회수 ${post.knowhow_count}</p>
                      </div>
                      <span class="post-tag">${knowhowPlantTags}</span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          `;
      }
    
  });

  return text;
};

const wrap = document.querySelector('.post-wrap')

postService.getList(page++,showList).then((text)=>{
  wrap.innerHTML += text
})

window.addEventListener("scroll", () => {
    // 맨위
    const scrollTop = document.documentElement.scrollTop;
    // 페이지 높이
    const windowHeight = window.innerHeight;
    // 암튼 높이
    const totalHeight = document.documentElement.scrollHeight;
    // 전체 높이에서 내가 보는 스크롤이 total보다 크면 추가

    if (scrollTop + windowHeight >= totalHeight) {
        postService.getList(page++,showList).then((text)=>{
          wrap.innerHTML += text
        })
    }
});



















