// 마이페이지/프로필/노하우 js 파일


/*
  각 리뷰글에 마우스 올린 경우 제목, 본문, 이미지 투명도 조정
*/

// 각 리뷰글
const reviewsItems = document.querySelectorAll(".reviews-history-item-wrap");

// 각 리뷰글에 mouseover, mouseout 이벤트 추가
reviewsItems.forEach((item) => {
  // 각 리뷰글의 이미지, 제목, 본문을 변수화
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
let page = 1
const showReviewList = (reviews) => {
  let text = ``;
  console.log('모든 리스트 보여주기3');

  reviews.forEach((review) => {
    let lecturePlantTags = ""; // postPlantTags 변수를 미리 정의하고 초기화

      lecturePlantTags = review.lecture_plant.map(plant => `
                  <li class="item-tags">
                    <div>
                      <button
                        class="item-tags-button"
                        type="button"
                      >
                        ${plant}
                      </button>
                    </div>
                  </li>`).join('');

      text += `
         <div class="reviews-history-item-wrap">
                  <a href="/lecture/detail/${review.lecture_status}/?id=${review.lecture_id}" class="reviews-history-link"></a>
                  <div class="reviews-history-item-container">
                    <div class="reviews-item-image-wrap" style="opacity: 1">
                      <img alt=""
                        class="reviews-item-image"
                        src="/upload/${review.lecture_file}"
                      />
                    </div>
                    <div class="reviews-item-title-wrap" style="opacity: 1">
                      <span>${review.review_title}</span>
                    </div>
                    <div class="reviews-item-article-wrap" style="opacity: 1">
                      <span>${review.review_content}</span>
                    </div>
                    <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
                    <div class="reviews-item-info-wrap">
                      <div class="article-info-wrap">
                        <!-- 작성자 -->
                        <div class="user-info-wrap">
                          ${review.lecture_title}
                        </div>
                        <!-- 올린 시간, 조회수, 지역 -->
                        <div class="item-info-wrap">
                          <div class="item-infos">${timeForToday(review.updated_date)}</div>
                          <div class="item-infos">별점 ${review.review_rating}</div>
                          <div class="item-infos">${review.lecture_category}</div>
                        </div>
                      </div>
                      <!-- 태그 -->
                      <div class="item-tags-wrap">
                        <ul class="item-tags-container">
                          ${lecturePlantTags} <!-- postPlantTags 변수를 여기서 사용 -->
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 각 내역 사이의 구분선 -->
                <hr class="items-seperator" />
      `;

  });

  return text;
};

const target = document.querySelector('.post-wrap')
postService.getReviews(page++,showReviewList).then((text)=>{
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
       postService.getReviews(page++,showReviewList).then((text)=>{
          target.innerHTML += text
        })


    }
});

