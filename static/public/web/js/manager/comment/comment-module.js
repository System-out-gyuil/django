const manageReply = (() => {
   const getReply = async (keyword, page, callback) => {
       const response = await fetch(`/admin/replies/api/?keyword=${keyword}&page=${page}`)
       const replies = await response.json()

       if(callback){
           return callback(replies)
       }
       return replies
   }

   const remove = async (replyList) => {
       await fetch(`/admin/replies/api/`, {
           method: 'DELETE',
           headers: {
               'Content-Type': 'application/json;charset=utf-8',
               'X-CSRFToken': csrf_token
           },
           body: JSON.stringify(replyList)
       })
   }

    return {getReply: getReply, remove: remove}
})()