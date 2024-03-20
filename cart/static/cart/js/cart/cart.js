
const showPrice = (detail)=>{
    let textlist = ``
    let totalPrice = detail[0]['lecture_price'] * detail[0]['quantity']
    totalPrice = totalPrice.toLocaleString('ko-KR')
    textlist +=`
      <div class="price-wrap ${detail[0]['id']}">
        <div class="name-side">${detail[0]['lecture_title']}</div>
        <div class="price-side">${totalPrice}원</div>
      </div>
    `
    return textlist
}

const showCartItems = (details)=>{
  let text =``

  details.forEach((detail)=> {
      let totalPrice = detail['quantity'] * detail['lecture_price']
      totalPrice = totalPrice.toLocaleString('ko-KR')

    if ( detail.length ===0 ){
      text =`
        <div class="no-items-wrap">
            <h1 class="no-items-text">아직 장바구니에 담은 상품이 없어요.</h1>
            <div class="purchase-link-button-wrap">
              <a href="/lecture/total/" class="purchase-link-button">강의 바로가기</a>
            </div>
        </div>
      `
    }else{
    text += `
      <li class="product-preview-wrap ${detail['id']}">
        <div class="product-preview-container">
          <div class="product-preview-inner">
            <div class="selection ${detail['id']}"></div>
            <h3 class="user-name">${detail['lecture_title']}</h3>
            <div class="delete ${detail['id']}">삭제</div>
          </div>
          <hr class="divide"/>
        </div>
        <div class="order-product-info">
          <figure class="product-preview-image">
            <img
                src="/upload/${detail['lecture_file']}"
                class="product-image" alt=""
            />
          </figure>
          <div class="product-info-contents">
            <div class="delivery-condition">강사명 | ${detail['teacher_name']}</div>
            <p class="product-name">
              ${detail['date']} | ${detail['time']} | ${detail['kit']}
            </p>
            <p class="product-option">
            <div class="selected-product-count">
            인원
                <div class="counted-number">
                  ${detail['quantity']}
                </div>
              </div>
            </p>
            <div class="product-price">
              <span class="price-number">${totalPrice}</span>
              <span class="won">원</span>
            </div>
          </div>
        </div>
      </li>
    `
    }

  })
  return text;

}

const ul = document.querySelector('.cart-item-wrap')
const sidebar = document.querySelector('.payment-detail-container')
cartService.getList(cart_id, showCartItems).then((text) => {
    ul.innerHTML = text;
});

ul.addEventListener("click", async (e) => {
    if(e.target.classList[0] === 'delete'){
        // 삭제 버튼 클릭 시
        const detailId = e.target.classList[1];
        await cartService.remove(detailId);
        const text = await cartService.getList(cart_id, showCartItems);
        ul.innerHTML = text;
        const div = document.querySelector('.product-name-side');
        const children = Array.from(div.children);
        children.forEach((child) => {
            targetId = child.classList[1];
            if(targetId === e.target.classList[1]){
                child.remove();
            }
        });
    } else if(e.target.classList[0] === 'selection') {
        // 선택 버튼 클릭 시
        let target = e.target;
        e.target.classList.toggle('count');
        if(target.classList.contains('count')) {
            // 선택된 경우
            target.style.backgroundColor = '#C06888';
            const div = document.querySelector('.product-name-side');
            const detailId = e.target.classList[1];
            const textlist = await cartService.select(detailId, showPrice);
            div.innerHTML += textlist;
            const prices = div.querySelectorAll('.price-side');
            let realTotalPrice = 0;
            prices.forEach((price) => {
                realTotalPrice += parseInt(price.innerText.replace(/[^\d]/g, ''));
            });
            const priceDiv = document.querySelector('.total-price');
            priceDiv.innerHTML = realTotalPrice.toLocaleString('ko-KR') + '원';
        } else {
            // 선택 해제된 경우
            target.style.backgroundColor = '#fff';
            const div = document.querySelector('.product-name-side');
            const children = Array.from(div.children);
            children.forEach((child) => {
                targetId = child.classList[1];
                if (targetId === target.classList[1]) {
                    child.remove();
                    // 선택 해제된 상품의 가격을 총 가격에서 제거
                    const removedPrice = parseInt(child.querySelector('.price-side').innerText.replace(/[^\d]/g, ''));
                    const priceDiv = document.querySelector('.total-price');
                    const totalPrice = parseInt(priceDiv.innerText.replace(/[^\d]/g, ''));
                    const newTotalPrice = totalPrice - removedPrice;
                    priceDiv.innerHTML = newTotalPrice.toLocaleString('ko-KR') + '원';
                }
            });
        }
        }
});