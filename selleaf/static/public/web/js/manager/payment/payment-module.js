const paymentService = (() => {
    const getPaymentList = async (keyword, page, callback) => {
        // API에 데이터 요청
        const response = await fetch (`/admin/payment-list/?keyword=${keyword}&page=${page}`);
        const paymentList = await response.json();

        // 콜백함수를 인자로 받았다면 콜백함수에 처리를 넘김
        if (callback) {
            return callback(paymentList);
        }

        // 콜백함수를 받지 않았다면 데이터만 반환
        return paymentList;
    }

    return {getPaymentList: getPaymentList}
})()