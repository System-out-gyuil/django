// 강의 리뷰 목록을 화면에 띄우는 함수
const showReviews = (reviews_info) => {
    // HTML 코드를 담기 위한 빈 문자열
    let text = ``;

    // 받아온 데이터들 중 'reviews' 만 따로 가져옴
    const reviews = reviews_info.reviews;

    // 받아온 리뷰 정보로 화면에 뿌릴 HTML 태그 생성
    reviews.forEach((review) => {
        text += `
                  <li class="list-content">
                    <input type="checkbox" class="checkbox-input" />
                    <div class="review-info-wrap">
                      <div class="review-info title">
                          <p class="review-title">${review.review_title}</p>
                          <p class="review-content">${review.review_content}</p>
                      </div>
                      <div class="review-info">${review.member_name}</div>
                      <div class="review-info">${review.review_rating}</div>
                      <div class="review-info">${review.created_date}</div>
                    </div>
                  </li>
        `;
    });

    // 완성된 HTML 코드 반환
    return text;
}