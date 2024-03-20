// 마이페이지/프로필/노하우 js 파일
/*
  각 내역에 마우스 올린 경우 제목, 본문, 이미지 투명도 조정
*/

// 우선 모든 내역을 가져옴
const lectureItems = document.querySelectorAll(".my_lecture-history-item-wrap");

// 각 내역에 mouseover, mouseout 이벤트 추가
lectureItems.forEach((item) => {
  // 각 내역의 이미지, 제목, 본문을 변수화
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

const showApplies = (applies) => {
    applies.sort((a, b) => b.apply_status - a.apply_status);

    let text = ``
    applies.forEach((apply) => {
        const lecturePlantTags = apply.lecture_plant.map(plant => `
              <li class="item-tags">
                <div>   
                  # ${plant}             
                </div>
              </li>`).join('');
        if(apply.apply_status === 1) {
            if(apply.lecture_review.length === 0) {
                text += `
                <div class="lecture-history-item-wrap">
                  <a href="/lecture/detail/${apply.lecture_status}/?id=${apply.lecture_id}" class="lecture-history-link"></a>
                    <div class="lecture-history-item-container">
                      <div class="lecture-item-image-wrap">
                        <img  alt=""
                          class="lecture-item-image"
                          src="/upload/${apply.lecture_file}"
                        />
                      </div>
                      <div class="lecture-item-title-wrap">
                        <span>${apply.lecture_title}</span>
                      </div>
                      <div class="lecture-item-article-wrap">
                        <span>${apply.lecture_content}</span>
                      </div>
                      <div class="write-review-wrap">
                        <a href="/member/mypage/writereviews/${apply.lecture_id}" class="write-review-button">
                          강의 리뷰 쓰기
                        </a>
                      </div>
                      <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
                      <div class="lecture-item-info-wrap">
                        <div class="article-info-wrap">
                          <div class="user-info-wrap">
                            ${apply.teacher_name}
                          </div>
                          <!-- 올린 시간, 조회수, 지역 -->
                          <div class="item-info-wrap">
                            <div class="item-infos">
                              ${apply.date} 수강
                            </div>
                            <div class="item-infos">${apply.time}</div>
                            <div class="item-infos">${apply.kit}</div>
                            <div class="item-infos">${apply.lecture_category}</div>
                          </div>
                        </div>
                      </div>
                      <div class="item-tags-wrap">
                          <ul class="item-tags-container">
                            ${lecturePlantTags}
                          </ul>
                       </div>
                    </div>
                  </div>
                  `;
            }else{
                text += `
                <div class="lecture-history-item-wrap">
                  <a href="/lecture/detail/${apply.lecture_status}/?id=${apply.lecture_id}" class="lecture-history-link"></a>
                    <div class="lecture-history-item-container">
                      <div class="lecture-item-image-wrap">
                        <img  alt=""
                          class="lecture-item-image"
                          src="/upload/${apply.lecture_file}"
                        />
                      </div>
                      <div class="lecture-item-title-wrap">
                        <span>${apply.lecture_title}</span>
                      </div>
                      <div class="lecture-item-article-wrap">
                        <span>${apply.lecture_content}</span>
                      </div>
                      <div class="write-review-wrap" style="color: #134F2C; font-size: 13px" >
                          리뷰 작성 완료
                      </div>
                      <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
                      <div class="lecture-item-info-wrap">
                        <div class="article-info-wrap">
                          <div class="user-info-wrap">
                            ${apply.teacher_name}
                          </div>
                          <!-- 올린 시간, 조회수, 지역 -->
                          <div class="item-info-wrap">
                            <div class="item-infos">
                              ${apply.date} 수강
                            </div>
                            <div class="item-infos">${apply.time}</div>
                            <div class="item-infos">${apply.kit}</div>
                            <div class="item-infos">${apply.lecture_category}</div>
                          </div>
                        </div>
                      </div>
                      <div class="item-tags-wrap">
                          <ul class="item-tags-container">
                            ${lecturePlantTags}
                          </ul>
                       </div>
                    </div>
                  </div>
                  `;
            }

        }else if(apply.apply_status === 0) {
            text += `
            <div class="lecture-history-item-wrap">
              <a href="/lecture/detail/${apply.lecture_status}/?id=${apply.lecture_id}" class="lecture-history-link"></a>
                <div class="lecture-history-item-container">
                  <div class="lecture-item-image-wrap">
                    <img  alt=""
                      class="lecture-item-image"
                      src="/upload/${apply.lecture_file}"
                    />
                  </div>
                  <div class="lecture-item-title-wrap">
                    <span>${apply.lecture_title}</span>
                  </div>
                  <div class="lecture-item-article-wrap">
                    <span>${apply.lecture_content}</span>
                  </div>
                  <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
                  <div class="lecture-item-info-wrap">
                    <div class="article-info-wrap">
                      <!-- 작성자 -->
                      <div class="user-info-wrap">
                        ${apply.teacher_name}
                      </div>
                      <!-- 올린 시간, 조회수, 지역 -->
                      <div class="item-info-wrap">
                        <div class="item-infos">
                          ${apply.date} 수강 예정
                        </div>
                        <div class="item-infos">${apply.time}</div>
                        <div class="item-infos">${apply.kit}</div>
                        <div class="item-infos">${apply.lecture_category}</div>
                      </div>
                    </div>
                  </div>
                  <div class="item-tags-wrap">
                      <ul class="item-tags-container">
                        ${lecturePlantTags}
                      </ul>
                   </div>
                </div>
              </div>
              `;
        }
    });
        return text;
  };

const wrap = document.querySelector('.post-wrap')

lectureService.lectureList(page++,showApplies).then((text)=>{
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
      lectureService.lectureList(page++,showApplies).then((text)=>{
        wrap.innerHTML += text
      })
    }
});


wrap.addEventListener('click',(e)=>{
    console.log(e.target)
})






