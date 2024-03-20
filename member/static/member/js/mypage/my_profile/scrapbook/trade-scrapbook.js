// 마이페이지/프로필/스크랩북 js 파일

// 화면 우하단에 있는 화살표 버튼 - click 이벤트
// 클릭 시, 화면 최상단으로 스무스하게 스크롤 이동
// 필요한 객체 가져오기
const topButton = document.querySelector(".top-button-wrap");

// 클릭 이벤트 추가
topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

// 페이지가 어느 정도 스크롤이 되었을 때만 최상단 이동 버튼이 뜨게 하기
// header 높이보다 많이(80.75px) 스크롤 했을 때 버튼 표시
// 필요한 객체 가져오기
const headerHeight = parseFloat(document.querySelector("header").style.height); // header의 높이

window.addEventListener("scroll", () => {
  // window.scrollY(아래로 스크롤 한 정도)가 header의 높이보다 커지면 버튼 표시
  if (window.scrollY > headerHeight) {
    // 만약 현재 버튼이 숨겨진(display: none) 상태라면
    if (topButton.style.display == "none") {
      // display를 block으로 바꿔서 보이게 함
      topButton.style.display = "block";
    }
    // display가 none이 아니라면 그대로 둠
    return;
  }
  // 만약 스크롤 정도가 header의 높이보다 작다면
  // 현재 보이는(display: block) 상태인지 체크
  if (topButton.style.display == "block") {
    // display를 none으로 바꿔서 다시 안 보이게 함
    topButton.style.display = "none";
  }
});







let page = 1
const showList = (scrapTrades) => {
  let text = ``
  scrapTrades.forEach((scrapTrade) => {
      const postPlantTags = scrapTrade.trade_plant.map(plant => `<span class="post-tag-icon">${plant}</span>`).join('');
          text += `
            <div class="post-container">
              <div class="post-inner">
                <article class="post">
                  <a href="/trade/detail/?id=${scrapTrade.trade_id}" class="post-link"></a>
                  <div class="post-image-wrap_">
                    <div class="post-image-container">
                      <div class="post-image-inner">
                        <div class="post-image"></div>
                        <img
                          src="/upload/${scrapTrade.trade_file}"
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
                        <span class="post-contents-user">${scrapTrade.member_name}</span>
                        <span class="post-contents-banner">${scrapTrade.trade_title}</span>
                      </h1>
                      <span class="post-price">
                        <span class="post-price-letter">${scrapTrade.trade_price.toLocaleString('ko-KR')}원</span>
                      </span>
                      <span class="post-tag">
                        ${postPlantTags}
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          `;
  });

  return text;
};


const wrap = document.querySelector('.post-wrap')

postService.getScrapTrades(page++,showList).then((text)=>{
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
        postService.getScrapTrades(page++,showList).then((text)=>{
          wrap.innerHTML += text
        })

    }
});
