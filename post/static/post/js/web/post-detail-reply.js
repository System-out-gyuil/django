let page = 1;

const writeButton = document.querySelector(".comment-submit-btn");
const replySection = document.querySelector(".reply-section");
const replyCountMain = document.querySelector(".comment-count");
const moreButton = document.getElementById("more-replies");
const replyCountSpan = document.getElementById("reply-count")
const knowhowUpDate = document.querySelector(".week-data")

replyService.getList(post_id, page + 1).then((replies) => {
    if (replies['replies'].length !== 0){
        moreButton.style.display = "flex";
    }
});

const countReply = (replies) => {
    let replyCount = `${replies['reply_count']}`
    return replyCount
}

const getPostDate = (replies) => {
    let upDate = `${timeForToday(replies['post_date'][0].created_date)}`
    return upDate
}

const showList = (replies) => {
    let text = ``;
    console.log(replies)
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
                            ${reply.post_reply_content}
                          </div>
                          
                          <section class="reply-update-wrap" id="update-form${reply.id}">
                            <textarea id="" cols="30" rows="1" placeholder="내 댓글">${reply.post_reply_content}</textarea>
                            <div class="button-wrap">
                                <button class="update-done ${reply.id}">작성완료</button>
                                <button class="cancel-btn ${reply.id}">취소</button>
                            </div>
                          </section>
                        
                          <div class="comment-data">
                            <div class="time-before">${timeForToday(reply.created_date)}</div>
                            
                            `;

                            if(reply.member_id === Number(member_id)) {
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
                                    `
                            }else {
                                text += `
                                    <div class="comment-declaration-btn-box">
                                      <div class="comment-split">・</div>
                                      <button type="button" class="reply-report-btn ${reply.id} comment-declaration-btn">
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
    replyService.getList(post_id, ++page, showList).then((text) => {
        replySection.innerHTML += text;
    });

    replyService.getList(post_id, page + 1).then((replies) => {
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
        post_id: post_id
    });
    replyContent.value = "";

    page = 1
    const text = await replyService.getList(post_id, page, showList);
    replySection.innerHTML = text;

    const replies = await replyService.getList(post_id, page + 1);


    const replyCountNum = await replyService.getList(post_id, page, countReply);
    replyCountSpan.innerText = replyCountNum
    replyCountMain.innerText = replyCountNum



    if (replies['replies'].length !== 0){
        moreButton.style.display = "flex";
    }



    commentSubmitBtn.disabled = true;
    commentSubmitBtn.style.cursor = 'context-menu';
    commentSubmitBtn.style.color = "rgb(194, 200, 204)"
});

replyService.getList(post_id, page, showList).then((text) => {
    replySection.innerHTML = text;
});
replyService.getList(post_id, page, getPostDate).then((postDate) => {
    knowhowUpDate.innerText = postDate;
});
replyService.getList(post_id, page, countReply).then((replyCount) => {
    replyCountSpan.innerHTML = replyCount;
    replyCountMain.innerText = replyCount
});


const replyModal = document.querySelector(".reply-declaration-modal-wrap")
replySection.addEventListener("click", async (e) => {
    console.log(e.target)
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
        const text = await replyService.getList(post_id, page, showList);
        replySection.innerHTML = text;
        const replies = await replyService.getList(post_id, page + 1);
        if (replies['replies'].length !== 0){
            moreButton.style.display = "flex";
        }

    }else if(e.target.classList[0] === 'remove-btn'){
        const replyId = e.target.classList[1];
        await replyService.remove(replyId);
        page = 1
        const text = await replyService.getList(post_id, page, showList);
        replySection.innerHTML = text;

        const replies = await replyService.getList(post_id, page + 1);
        if (replies['replies'].length !== 0){
            moreButton.style.display = "flex";
        }
    }else if(e.target.classList[0] === 'reply-report-btn') {
        console.log('report')
        replyModal.classList.add("open")
        replyReportReplyId.value = e.target.classList[1]
    }

});

//신고 모달 없애기
// 취소하기 버튼
const cancelReplyDeclarationBtn = document.querySelector(".cancel-reply-declaration-btn");
// 신고하기 버튼
const reportReplyDeclarationBtn = document.querySelector(".report-reply-declaration-btn");
// 신고된 내용 들어갈 input
const replyReportInput = document.querySelector(".reply-report-content")
// 신고된 댓글번호 들어갈 input
const replyReportReplyId = document.querySelector(".reply-report-reply-id")

// 취소하기 버튼 클릭 시
cancelReplyDeclarationBtn.addEventListener("click", () => {
  replyModal.classList.remove("open");
  replyReportReplyId.value = ''
});

// 신고하기 버튼 클릭 시
reportReplyDeclarationBtn.addEventListener("click", (e) => {
  let reportContent = ''
  declarationItems.forEach((item) => {
    if(item.classList[1] === "report-choice"){
      // console.log(item.innerText)
      reportContent = item.innerText

      }
    })
  replyReportInput.value = reportContent
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
