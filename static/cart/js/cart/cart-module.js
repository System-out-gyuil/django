const cartService = (()=>{
    const getList = async (cart_id, callback) =>{
        const response = await fetch(`/cart/list/${cart_id}`);
        const details = await response.json();
        if (callback){
            return callback(details)
        }
        return details

    };

    const remove = async (detailId) => {
        await fetch(`/cart/${detailId}/`, {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            }
        });
    }

    const select = async (detailId, callback) =>{
        const response = await fetch(`/cart/${detailId}`);
        const detail = await response.json();
        if (callback){
            return callback(detail)
        }
        return detail
    };

    const submit = async (cart_id) =>{
        await fetch(`/cart/checkout/${cart_id}/`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-CSRFToken': csrf_token
            }
        });
    }


    return {getList:getList, remove:remove, select:select, submit:submit}

})()