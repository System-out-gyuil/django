const searchService = (() => {
  const getList = async (searchData) => {
    const url = `/search/api/?query=${searchData}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      }
    });
    return await response.json();
  }
  return {getList: getList}
})()

const searchHistoryService = (() => {
  const list = async () => {
    const url = `/search-history/api/`;
    const response = await fetch(url);
    return await response.json();
  }
  const del = async (searchData) => {
    console.log(searchData);
    const url = `/search-history/api/`;
    await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      },
      body: JSON.stringify({data: searchData})
    });
  }
  const allDel = async () => {
    const url = `/search-history/api/`;
    await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'X-CSRFToken': csrf_token
      }
    });
  }
  return {list: list, del: del, allDel: allDel}
})()