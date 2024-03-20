const knowhowScrapService = (() => {
  const update = async (knowhowId) => {
    const respones = await fetch(`/knowhow-scrap/api/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      },
      body: JSON.stringify({'knowhow_id': knowhowId})
    });
    return await respones.json()
  }
  return {update: update}
})()

const tradeScrapService = (() => {
  const update = async (tradeId) => {
    const respones = await fetch(`/trade-scrap/api/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      },
      body: JSON.stringify({'trade_id': tradeId})
    });
    return await respones.json()
  }
  return {update: update}
})()

const lectureScrapService = (() => {
  const update = async (lectureId) => {
    const respones = await fetch(`/lecture-scrap/api/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      },
      body: JSON.stringify({'lecture_id': lectureId})
    });
    return await respones.json()
  }
  return {update: update}
})()
const postScrapService = (() => {
  const update = async (postId) => {
    const respones = await fetch(`/post-scrap/api/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      },
      body: JSON.stringify({'post_id': postId})
    });
    return await respones.json()
  }
  return {update: update}
})()