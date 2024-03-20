let page = 1
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...'; // 말줄임표 추가
    } else {
        return text;
    }
}
const showAlarm = (alarms) => {
  let totalalarms = alarms.length
  const alarmCounts = document.querySelectorAll('.alarm-count')
  alarmCounts.forEach((alarmCount)=>{
    alarmCount.innerText = totalalarms
  })
  let text = ``
  alarms.forEach((alarm) => {
      let member_file = ''
      if(alarm.member_file.includes('http')){
        member_file = alarm.member_file
      }else{
          member_file = `/upload/${alarm.member_file}`
      }

      if( alarm.alarm_category === 1){
          text += `
            <div>    
              <div class="notice-contents">
                <a href="" class="notice-profile-box">
                  <img src="${member_file}" alt="" class="notice-profile" />
                </a>
                <a href="${alarm.target_url}" class="notice-content-box">
                  <div class="inner-txt-wrap">
                    <span class="inner-txt">
                      <strong>${alarm.sender}</strong>
                        ${alarm.message}                  
                    </span>
                    <span class="last-time">${timeForToday(alarm.updated_date)}</span>
                  </div>
                  <img src="/upload/${alarm.target_file}" alt="" class="notice-img" />
                </a>
                <div class="check ${alarm.id}">확인</div>
              </div>
            <div>`
      }
      else if( alarm.alarm_category === 3 || alarm.alarm_category === 5 || alarm.alarm_category === 6){
        text += `
        <div>    
          <div class="notice-contents">
            <a href="" class="notice-profile-box">
              <img src="${member_file}" alt="" class="notice-profile" />
            </a>
            <a href="${alarm.target_url}${alarm.target_id}" class="notice-content-box">
              <div class="inner-txt-wrap">
                <span class="inner-txt">
                  <strong>${alarm.sender}</strong>
                    ${alarm.message}                  
                </span>
                <span class="inner-txt">
                    ${truncateText(alarm.reply,20)}                  
                </span>
                <span class="last-time">${timeForToday(alarm.updated_date)}</span>
              </div>
              <img src="/upload/${alarm.target_file}" alt="" class="notice-img" />
            </a>
            <div class="check ${alarm.id}">확인</div>
          </div>
         
        <div>`
      }else{
      text += `
        <div>    
          <div class="notice-contents">
            <a href="" class="notice-profile-box">
              <img src="${member_file}" alt="" class="notice-profile" />
            </a>
            <a href="${alarm.target_url}${alarm.target_id}" class="notice-content-box">
              <div class="inner-txt-wrap">
                <span class="inner-txt">
                  <strong>${alarm.sender}</strong>
                    ${alarm.message}                  
                </span>
                <span class="last-time">${timeForToday(alarm.updated_date)}</span>
              </div>
              <img src="/upload/${alarm.target_file}" alt="" class="notice-img" />
            </a>
            <div class="check ${alarm.id}">확인</div>
          </div>
        <div>`
      }
  });
  return text;
}

const target = document.querySelector('.here')

alarmService.alarmList(page++,showAlarm).then((text)=>{
  target.innerHTML += text
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

    alarmService.alarmList(page++,showAlarm()).then((text)=>{
      target.innerHTML += text
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

target.addEventListener('click',async (e)=>{
    if(e.target.classList[0]==='check'){
        const alarm_id = e.target.classList[1];
        await alarmService.removeAlarm(alarm_id);}
    page = 1
    const updatedText = await alarmService.alarmList(page, showAlarm);
    target.innerHTML = updatedText;
})

const readAll = document.querySelector('.check-all')

readAll.addEventListener('click', async (e)=>{
    await alarmService.removeAll(page)
    page = 1
    const newText = await alarmService.alarmList(page,showAlarm);
    target.innerHTML = newText;
})