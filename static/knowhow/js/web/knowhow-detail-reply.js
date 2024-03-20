let page = 1;

const writeButton = document.querySelector(".comment-submit-btn");
const replySection = document.querySelector(".reply-section");
const replyCountMain = document.querySelector(".comment-count");
const moreButton = document.getElementById("more-replies");
const replyCountSpan = document.getElementById("reply-count")
const knowhowUpDate = document.querySelector(".week-data")
const likeCountdd = document.querySelector(".like-data")
const scrapCountdd = document.querySelector(".scrap-data")
const likeCountSpan = document.getElementById("like-count")
const scrapCountSpan = document.getElementById("scrap-count")

replyService.getList(knowhow_id, page + 1).then((replies) => {
    if (replies['replies'].length !== 0){
        moreButton.style.display = "flex";
    }
});

const countReply = (replies) => {
    let replyCount = `${replies['reply_count']}`
    return replyCount
}

const countLike = (replies) => {
    let likeCount = `${replies['like_count']}`
    return likeCount
}

const countScrap = (replies) => {
    let scrapCount = `${replies['scrap_count']}`
    return scrapCount
}

const getKnowhowDate = (replies) => {
    let upDate = `${timeForToday(replies['knowhow_date'][0].created_date)}`
    return upDate
}



const showList = (replies) => {
    let text = ``;
    replies['replies'].forEach((reply) => {
        // console.log(reply.created_date)
        text += `
            <div class="comment-item-box">
                      <div class="comment-item">
                        <div class="comment-user-img-wrap">
                          <figure class="comment-user-img-container">
                            <img
                              src="${reply.member__memberprofile__file_url}"
                              height="0"
                              class="comment-user-img"
                            />
                          </figure>
                        </div>
                        <div class="comment-content-box">
                          <div class="comment-user-name-box">
                            <div role="link" class="commment-user-name">
                              ${reply.member_name}
                            </div>
                          </div>
                          <div class="comment">
                            ${reply.knowhow_reply_content}
                          </div>
                          
                          <section class="reply-update-wrap" id="update-form${reply.id}">
                            <textarea id="" cols="30" rows="1" placeholder="내 댓글">${reply.knowhow_reply_content}</textarea>
                            <div class="button-wrap">
                                <button class="update-done ${reply.id}">작성완료</button>
                                <button class="cancel-btn ${reply.id}">취소</button>
                            </div>
                          </section>
                        
                          <div class="comment-data">
                            <div class="time-before">${timeForToday(reply.created_date)}</div>
                            
                            `;
                            
                            if(reply.member_id === Number(member_Id)) {
                                text += `
                                    <div class="comment-declaration-btn-box">
                                      <div class="comment-split">・</div>
                                      <button type="button" class="update-btn ${reply.id}">
                                        수정
                                      </button>
                                    </div>
                                    <div class="comment-declaration-btn-box">
                                      <div class="comment-split">・</div>
                                      <button type="button" class="remove-btn ${reply.id}">
                                        삭제
                                      </button>
                                    </div>
                                `}else {
                                text += `
                                    <div class="comment-declaration-btn-box">
                                                  <div class="comment-split">・</div>
                                                  <button type="button" class="comment-declaration-btn">
                                                    신고
                                                  </button>
                                                </div>
                                `
                            }

                            text += `
                                                
                                               </div>
                                              </div>
                                            </div>
                                           </div>
                            `;
    });

    return text;
}

moreButton.addEventListener("click", (e) => {
    replyService.getList(knowhow_id, ++page, showList).then((text) => {
        replySection.innerHTML += text;
    });

    replyService.getList(knowhow_id, page + 1).then((replies) => {
    if (replies['replies'].length === 0){
        moreButton.style.display = "none";
    }
});

});

writeButton.addEventListener("click", async (e) => {
    const replyContent = document.getElementById("reply-content");
    console.log(replyContent.value)
    await replyService.write({
        reply_content: replyContent.value,
        knowhow_id: knowhow_id
    });
    replyContent.value = "";

    page = 1
    const text = await replyService.getList(knowhow_id, page, showList);
    replySection.innerHTML = text;

    const replies = await replyService.getList(knowhow_id, page + 1);


    const replyCountNum = await replyService.getList(knowhow_id, page, countReply);
    replyCountSpan.innerText = replyCountNum
    replyCountMain.innerText = replyCountNum



    if (replies['replies'].length !== 0){
        moreButton.style.display = "flex";
    }



    commentSubmitBtn.disabled = true;
    commentSubmitBtn.style.cursor = 'context-menu';
    commentSubmitBtn.style.color = "rgb(194, 200, 204)"
});

replyService.getList(knowhow_id, page, showList).then((text) => {
    replySection.innerHTML = text;
});
replyService.getList(knowhow_id, page, getKnowhowDate).then((knowhowDate) => {
    knowhowUpDate.innerText = knowhowDate;
});

replyService.getList(knowhow_id, page, countReply).then((replyCount) => {
    replyCountSpan.innerHTML = replyCount;
    replyCountMain.innerText = replyCount
});
replyService.getList(knowhow_id, page, countLike).then((likeCount) => {
    likeCountdd.innerText = likeCount;
    likeCountSpan.innerText = likeCount;
});
replyService.getList(knowhow_id, page, countScrap).then((scrapCount) => {
    scrapCountdd.innerText = scrapCount;
    scrapCountSpan.innerText = scrapCount;
});



// ul 태그의 자식 태그까지 이벤트가 위임된다.
replySection.addEventListener("click", async (e) => {
    if(e.target.classList[0] === 'update-btn'){
        const replyId = e.target.classList[1]
        const updateForm = document.getElementById(`update-form${replyId}`)
        const commentData = e.target.closest(".comment-data")
        // const commentData = document.querySelector(".comment-data")

        updateForm.style.display = "block";
        updateForm.previousElementSibling.style.display = "none";

        commentData.style.display = "none"

    }else if(e.target.classList[0] === 'cancel-btn'){
        const replyId = e.target.classList[1]
        const updateForm = document.getElementById(`update-form${replyId}`)
        const commentData = updateForm.nextElementSibling

        updateForm.style.display = "none";
        updateForm.previousElementSibling.style.display = "block";
        commentData.style.display = "flex"


    }else if(e.target.classList[0] === 'update-done'){
        const replyId = e.target.classList[1]
        const replyContent = document.querySelector(`#update-form${replyId} textarea`);
        await replyService.update({replyId: replyId, replyContent: replyContent.value})
        page = 1
        const text = await replyService.getList(knowhow_id, page, showList);
        replySection.innerHTML = text;
        const replies = await replyService.getList(knowhow_id, page + 1);
        if (replies['replies'].length !== 0){
            moreButton.style.display = "flex";
        }

    }else if(e.target.classList[0] === 'remove-btn'){
        const replyId = e.target.classList[1];
        await replyService.remove(replyId);
        page = 1
        const text = await replyService.getList(knowhow_id, page, showList);
        replySection.innerHTML = text;

        const replies = await replyService.getList(knowhow_id, page + 1);
        if (replies['replies'].length !== 0){
            moreButton.style.display = "flex";
        }
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












