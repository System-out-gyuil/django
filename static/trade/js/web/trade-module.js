const tradeService = (() => {

    const getList = async (page, filters, sorting, types, callback) => {
        const response = await fetch(`/trade/total/${page}/${filters}/${sorting}/${types}`);
        const trades = await response.json();
        if(callback){
            return callback(trades);
        }
        return trades;
    }

    const localList = async (page, callback) => {
        const response = await fetch(`/trade/main/${page}`);
        const trades = await response.json();
        if(callback){
            return callback(trades);
        }
        return trades;
    }

    return {getList: getList, localList: localList}
})();

const tradeScrapService = (() => {
  const update = async (tradeId) => {
    await fetch(`/trade-scrap/api/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      },
      body: JSON.stringify({'trade_id': tradeId})
    });
  }

  return {update: update}
})()

const scrapCountService = (() => {

    const scrapCount = async (trade_id, callback) => {
        const response = await fetch(`/trade/detail/${trade_id}`);
        const trades = await response.json();
        if(callback){
            return callback(trades);
        }
        return trades;
    }

    return {scrapCount: scrapCount}
})();