const scrapBox = document.getElementById('scrap-box')
const likeBox = document.getElementById('like-box')
const scrapCountBox = document.getElementById('scrap-count')
const likeCountBox = document.getElementById('like-count')
const likeCountddBox = document.querySelector(".like-data")
const scrapCountddBox = document.querySelector(".scrap-data")

const ScrapCheck = (scraps) => {
    let scrap = ``;
    console.log(scraps)
    scrapCountBox.innerText = scraps['scrap_count']
    scrapCountddBox.innerText = scraps['scrap_count']
    if (scraps.check_scrap_status){
        scrap = `
            <img
                class="sticky-icon"
                src='/static/public/web/images/common/scrap-on.png'
                alt=""
                id="scrap-on"
            />
            `
    }else {
        scrap = `
            <img
                class="sticky-icon"
                src='/static/public/web/images/common/scrap-off.png'
                alt=""
                id="scrap-off"
            />
            `
    }
    return scrap
}

const LikeCheck = (likes) => {
    let like = ``;

    console.log(likes)
    likeCountBox.innerText = likes['like_count']
    likeCountddBox.innerText = likes['like_count']
    if (likes.check_like_status){
        like = `
            <img
                class="sticky-icon"
                src='/static/public/web/images/common/like-on.png'
                alt=""
                id="like-on"
            />
            `
    }else {
        like = `
            <img
                class="sticky-icon"
                src='/static/public/web/images/common/like-off.png'
                alt=""
                id="like-on"
            />
            `
    }
    return like
}


const likeCounted = (likeCounting) => {
    let countLike = `${likeCounting}`
    return countLike
}
const scrapCounted = (scrapCounting) => {
    let countScrap = `${scrapCounting}`
    return countScrap
}

postService.likeCount(post_id, likeCounted).then((countLike) => {
        likeCountBox.innerText = countLike
        likeCountddBox.innerText = countLike
    })

postService.scrapCount(post_id, scrapCounted).then((countScrap) => {
        scrapCountBox.innerText = countScrap
        scrapCountddBox.innerText = countScrap
    })



scrapBox.addEventListener("click", (e) => {
    let scrap_status = ''
    if (scrapBox.classList[1] === 'scrap-check-on'){
        scrapBox.classList.remove('scrap-check-on')
        scrapBox.classList.add('scrap-check-off')
        scrap_status = 'False'

    }else if(scrapBox.classList[1] === 'scrap-check-off'){
        scrapBox.classList.remove('scrap-check-off')
        scrapBox.classList.add('scrap-check-on')
        scrap_status = 'True'

    }else if (e.target.getAttribute('src').includes('scrap-on')){
        scrap_status = 'False'

    }else if(e.target.getAttribute('src').includes('scrap-off')){
        scrap_status = 'True'

    }

    postService.getScrap(post_id, member_id, scrap_status, ScrapCheck).then((scrap) => {
        scrapBox.innerHTML = scrap
    })
})

likeBox.addEventListener("click", (e) => {
    let like_status = ''
    if (likeBox.classList[1] === 'like-check-on'){
        likeBox.classList.remove('like-check-on')
        likeBox.classList.add('like-check-off')
        like_status = 'False'

    }else if(likeBox.classList[1] === 'like-check-off'){
        likeBox.classList.remove('like-check-off')
        likeBox.classList.add('like-check-on')
        like_status = 'True'

    }else if (e.target.getAttribute('src').includes('like-on')){
        like_status = 'False'

    }else if(e.target.getAttribute('src').includes('like-off')){
        like_status = 'True'

    }

    postService.getLike(post_id, member_id, like_status, LikeCheck).then((like) => {
        likeBox.innerHTML = like
    })
})