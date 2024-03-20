// 마이페이지/강의 현황/예정 강의(강사 전용 페이지) js 파일

/* 
  각 내역에 마우스 올린 경우 제목, 본문, 이미지 투명도 조정
*/

// 우선 모든 내역을 가져옴
const classesItems = document.querySelectorAll(".my_classes-history-item-wrap");

// 각 내역에 mouseover, mouseout 이벤트 추가
classesItems.forEach((item) => {
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
  let text = ``
  applies.forEach((apply) => {
    const lecturePlantTags = apply.lecture_plant.map(plant => `
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
    if (apply.apply_status === 0) {
      text += `
          <a href="/lecture/detail/${apply.lecture_status}/?id=${apply.lecture_id}" class="classes-history-link"></a>
            <div class="classes-history-item-container">
              <div class="classes-item-image-wrap">
                <img alt=""
                     class="classes-item-image"
                     src="/upload/${apply.lecture_file}"
                />
              </div>
              <div class="classes-item-title-wrap">
                <span>${apply.lecture_title}</span>
              </div>
              <div class="classes-item-article-wrap">
                <span>${apply.lecture_content}</span>
              </div>
              <!-- 수강생 목록 바로가기 버튼 - 평소에 하던 버튼으로 제작 -->
              <div class="students-list-wrap">
                <a href="/member/mypage/teachers/apply/${apply.id}" class="students-list-button">
                  수강생 목록 보기
                </a>
              </div>
              <!-- 작성자, 조회수, 지역, 태그까지 모두 감싸는 부분 -->
              <div class="classes-item-info-wrap">
                <div class="article-info-wrap">
                  <!-- 작성자 -->
                  <div class="user-info-wrap">
                    ${apply.teacher_name}
                  </div>
                  <!-- 진행한 시간, 조회수, 지역 -->
                  <div class="item-info-wrap">
                    <div class="item-infos">${apply.date} 진행 예정</div>
                    <div class="item-infos">${apply.member_name}외 ${apply.trainee.length}</div>
                    <div class="item-infos">${apply.lecture_category}</div>
                  </div>
                </div>
                <!-- 태그 -->
                <div class="item-tags-wrap">
                  <ul class="item-tags-container">
                    ${lecturePlantTags}
                  </ul>
                </div>
              </div>
            </div>`
    }


  });
  return text;
}


const wrap = document.querySelector('.classes-history-item-wrap')

classService.classList(page++,showApplies).then((text)=>{
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
      classService.classList(page++,showApplies).then((text)=>{
        wrap.innerHTML += text
      })
    }
});





