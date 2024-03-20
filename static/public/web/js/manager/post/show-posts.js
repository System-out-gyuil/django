// 일반 게시물 목록을 화면에 띄우는 함수
const showPosts = (posts_info) => {
    // HTML 코드를 담기 위한 빈 문자열
    let text = ``;

    // 받아온 데이터들 중 'posts' 만 따로 가져옴
    const posts = posts_info.posts;

    // 받아온 게시물 정보로 화면에 뿌릴 HTML 태그 생성
    posts.forEach((post) => {
        text += `
                  <li class="list-content ${post.id}">
                    <input type="checkbox" class="checkbox-input" />
                    <div class="post-info-wrap">
                      <div class="post-info">${post.post_title}</div>
                      <div class="post-info">${post.post_content}</div>
                      <div class="post-info">${post.member_name}</div>
                      <div class="post-info">${post.category_name}</div>
                      <div class="post-info">${post.created_date}</div>
                    </div>
                  </li>
        `;
    });

    // 완성된 HTML 코드 반환
    return text;
}