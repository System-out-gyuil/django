// 마이페이지/프로필/노하우 js 파일

// /*
//   각 내역에 마우스 올린 경우 제목, 본문, 이미지 투명도 조정
// */
//
// // 우선 모든 내역을 가져옴
// const tradedItems = document.querySelectorAll(".trade-history-item-wrap");
//
// // 각 내역에 mouseover, mouseout 이벤트 추가
// tradedItems.forEach((item) => {
//   // 각 내역의 이미지, 제목, 본문을 변수화
//   const itemImage = item.children[1].children[0];
//   const itemTitle = item.children[1].children[1];
//   const itemArticle = item.children[1].children[2];
//
//   item.addEventListener("mouseover", () => {
//     itemImage.style.opacity = 0.6;
//     itemTitle.style.opacity = 0.6;
//     itemArticle.style.opacity = 0.6;
//   });
//
//   item.addEventListener("mouseout", () => {
//     itemImage.style.opacity = 1;
//     itemTitle.style.opacity = 1;
//     itemArticle.style.opacity = 1;
//   });
// });


let page = 1;

const showList = (trades) => {
  let text = ``
  trades.forEach((trade) => {
      const postPlantTags = trade.trade_plant.map(plant =>`
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
            <div class="trade-history-item-wrap">         
                <a href="/trade/detail/?id=${trade.id}" class="trade-history-link"></a>
                  <div class="trade-history-item-container">
                    <div class="trade-item-image-wrap">
                      <img  alt=""
                        class="trade-item-image"
                        src="/upload/${trade.trade_file}"
                      />
                    </div>
                    <div class="trade-item-title-wrap">
                      <span>${trade.trade_title}</span>
                    </div>
                    <div class="trade-item-article-wrap">
                      <span>${trade.trade_content}</span>
                    </div>
                    <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
                    <div class="trade-item-info-wrap">
                      <div class="article-info-wrap">
                        <!-- 작성자 -->
                        <div class="user-info-wrap">
                          ${trade.member_name}
                        </div>
                        <!-- 올린 시간, 조회수, 지역 -->
                        <div class="item-info-wrap">
                          <div class="item-infos">${timeForToday(trade.updated_date)}</div>
                          <div class="item-infos">${trade.trade_category}</div>
                          <div class="item-infos">${trade.trade_price}</div>
                        </div>
                      </div>
                      <!-- 태그 -->
                      <div class="item-tags-wrap">
                        <ul class="item-tags-container">
                          ${postPlantTags}
                        </ul>
                      </div>
                    </div>
                  </div>
            </div>
          <hr class="items-seperator" />  
          `;
        });
  return text;
};

const wrap = document.querySelector('.trade-history-wrap')

salesService.getList(page++,showList).then((text)=>{
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
        salesService.getList(page++,showList).then((text)=>{
          wrap.innerHTML += text
        })
    }
});




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
