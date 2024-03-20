// 전액 사용 눌렀을때 마일리지 창에 마일리지 들어가게
const useAll = document.querySelector(".use-all");
const mileageInput = document.querySelector(".mileage-usage");
const mileage = document.querySelector(".mileage");
let realRealM = mileage.innerText;
realRealM = parseInt(realRealM.replace(" ", ""))

useAll.addEventListener('click', ()=>{
    mileageInput.value = mileage.innerText;
    const realMileage = parseInt(mileageInput.value)
})


// 상품 총합 더하기
let sum = 0;
const productPrices = document.querySelectorAll(".product-price");
const quantitys = document.querySelectorAll(".quantity");

productPrices.forEach((productPrice, i)=>{
    // 가격
    let realPrice = productPrice.innerText;
    let productRealPrice = realPrice.replace("원", "");
    productRealPrice = parseInt(realPrice.replace(",", ""));

    // 개수
    let realQuantity = quantitys[i].innerText;
    realQuantity = parseInt(realQuantity.replace('개', ''));

    sum += productRealPrice * realQuantity
})

// 마일리지를 뺀 가격 구하기
const realSum = sum - realRealM;
console.log(sum)

// 총 상품 금액 (마일리지 차감 안한 순수 금액)
const emphasis = document.querySelector(".Total");
const useMileage = document.querySelector(".useMileage");
const totalPrice = document.querySelector(".total-price");
const point = document.querySelector(".value");
const summitBtn = document.querySelector(".summit");


emphasis.innerText = sum.toString().toLocaleString() + "원"
useMileage.innerText = realRealM + "원"
totalPrice.innerText = realSum + "원"
point.innerText = realSum.toString().slice(0, 3) + "p"
summitBtn.innerText = realSum.toLocaleString() + "원 결제하기"



// 주소 모달창 나오게
const addressModal = document.querySelector(".address-modal-wrap");
const modalBtn = document.querySelector(".change-button");

modalBtn.addEventListener("click", (e) => {
    addressModal.style.display = "block";
});

// 주소 모달창 닫기
const closeBtn = document.querySelector(".close-button");
closeBtn.addEventListener("click", (e) => {
    addressModal.style.display = "none";
});

// 주소 수정 모달창 나오게
const updateModal = document.querySelector(".address-update-modal-wrap");
const updateBtns = document.querySelectorAll(".update-button");

updateBtns.forEach((updateBtn) => {
    updateBtn.addEventListener("click", (e) => {
        updateModal.style.display = "block";
    });
});

// 주소 수정 모달창 뒤로가기
const backBtn = document.querySelector(".back-button");
backBtn.addEventListener("click", (e) => {
    updateModal.style.display = "none";
});

// 주소 수정 모달창 닫기
const cancelBtn = document.querySelector(".cancel-button");
cancelBtn.addEventListener("click", (e) => {
    updateModal.style.display = "none";
    addressModal.style.display = "none";
});

// 주소 추가 모달창 나오게
const addModal = document.querySelector(".add-address-total-wrap");
const addBtn = document.querySelector(".add-button");

addBtn.addEventListener("click", (e) => {
    addModal.style.display = "block";
});

// 주소 추가 모달창 뒤로가기
const addBack = document.querySelector(".add-back-button-image-wrap");
addBack.addEventListener("click", (e) => {
    addModal.style.display = "none";
});

// 주소 추가 모달창 닫기
const addClose = document.querySelector(".add-cancel-button");

addClose.addEventListener("click", (e) => {
    addModal.style.display = "none";
    addressModal.style.display = "none";
});

// 모달에서 삭제누르면 경고가 나오게

const deleteButtons = document.querySelectorAll(".delete-button");
const confirmModal = document.querySelector(".confirm-total-wrap");

deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener("click", (e) => {
        // 삭제 버튼을 누를 때 confirm 모달 표시
        confirmModal.style.display = "block";

        // 확인 버튼 이벤트
        const confirmAction = document.querySelector(".confirm");
        confirmAction.addEventListener("click", () => {
            // 확인을 누르면 삭제 수행
            const target = deleteButton.closest(".address-wrap");
            target.remove();

            // confirm 모달 숨김
            confirmModal.style.display = "none";
        });

        // 취소 버튼 이벤트
        const cancelAction = document.querySelector(".confirm-cancel");
        cancelAction.addEventListener("click", () => {
            // 취소를 누르면 confirm 모달 숨김
            confirmModal.style.display = "none";
        });
    });
});

// 기본배송지 수정 체크박스

const mainCheckers = document.querySelectorAll(".main-address-checker");
mainCheckers.forEach((mainChecker) => {
    mainChecker.addEventListener("click", (e) => {
        e.target.closest(".main-address-checker").classList.toggle("checked");
    });
});

// 주소찾기 api
window.onload = function () {
    const addressBtn = document.querySelector(".address-search-button");
    addressBtn.addEventListener("click", function () {
        //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) {
                //선택시 입력값 세팅
                console.log(data);
                document.querySelector(".zipcode").value = data.zonecode; // 주소 넣기
                document.querySelector(".address-input").value = data.address; //상세입력 포커싱
            },
        }).open();
    });
};

// 주소 추가 모달 주소찾기
window.onload = function () {
    const addressBtn = document.querySelector(".address-add-button");
    addressBtn.addEventListener("click", function () {
        //주소입력칸을 클릭하면
        //카카오 지도 발생
        new daum.Postcode({
            oncomplete: function (data) {
                //선택시 입력값 세팅
                console.log(data);
                document.querySelector(".added-zipcode").value = data.zonecode; // 주소 넣기
                document.querySelector(".added-address").value = data.address; //상세입력 포커싱
            },
        }).open();
    });
};

// 선택한 주소 화면에 적용
const selectBtns = document.querySelectorAll(".select-button");

selectBtns.forEach((selectBtn) => {
    selectBtn.addEventListener("click", handleSelectButtonClick);
});

function handleSelectButtonClick(event) {
    addressModal.style.display = "none";
    const target = event.target.closest(".address-wrap");
    if (!target) return; // 해당 요소가 없으면 함수 종료

    const placeInfo = document.querySelector(".delivery-place-name");
    const address = document.querySelector(".address");
    const userInfo = document.querySelector(".user-info-wrap");

    // 주소 정보 업데이트
    const updateAddress = target.querySelector(".address-text").textContent;
    const updateAddressTitle = target.querySelector(".address-title").textContent;
    const updateName = target.querySelector(".address-user-name").textContent;
    const updatePhone = target.querySelector(".address-user-phone").textContent;
    const updatetag = target.querySelector(".address-tag").textContent;

    // 화면에 정보 업데이트
    placeInfo.innerHTML = `<div class="address-name">${updateAddressTitle}</div>${updatetag && `<div class="tag">${updatetag}`}`;
    address.textContent = updateAddress;
    userInfo.innerHTML = `<div class="name">${updateName}</div><div class="phone">${updatePhone}</div>`;
}

// 결제 수단 선택하기
const payments = document.querySelectorAll(".payment");
const cardSelection = document.querySelector(".card-type-option-wrap");
payments.forEach((payment) => {
    payment.addEventListener("click", (e) => {
        let target = e.target.closest(".payment");
        payments.forEach((payment) => {
            let target = payment.closest(".payment");
            console.log(111);
            target.classList.remove("selected");
        });
        target.classList.add("selected");

        button = e.target.closest(".payment-button");
        console.log(button);
        button.title === "카드결제" ? (cardSelection.style.display = "block") : (cardSelection.style.display = "none");
    });
});

NodeList.prototype.filter = Array.prototype.filter;

// 결제창 동의 체크
const allCheckBox = document.querySelector(".total-agree-checkbox-wrap");
const checkBoxes = document.querySelectorAll(".term-checkbox-wrap");
const agreeDivs = document.querySelectorAll(".term-inner");
const agreeCheck = document.querySelectorAll(".check1");
const totalAgree = document.querySelector(".total-agree-wrap");
const totalCheck = document.querySelector(".total-check");

// 전체 동의 체크박스 클릭시
allCheckBox.addEventListener("click", (e) => {
    if (totalCheck.checked) {
        allCheckBox.classList.remove("checked");
        totalCheck.checked = false;
        agreeCheck.forEach((agree) => {
            agree.checked = false;
        });
        checkBoxes.forEach((box) => {
            box.classList.remove("checked");
        });
    } else {
        allCheckBox.classList.add("checked");
        totalCheck.checked = true;
        agreeCheck.forEach((agree) => {
            agree.checked = true;
        });
        checkBoxes.forEach((box) => {
            box.classList.add("checked");
        });
    }
});
// 전체 동의 텍스트 클릭 시
totalAgree.addEventListener("click", (e) => {
    if (totalCheck.checked) {
        allCheckBox.classList.remove("checked");
        totalCheck.checked = false;
        agreeCheck.forEach((agree) => {
            agree.checked = false;
        });
        checkBoxes.forEach((box) => {
            box.classList.remove("checked");
        });
    } else {
        allCheckBox.classList.add("checked");
        totalCheck.checked = true;
        agreeCheck.forEach((agree) => {
            agree.checked = true;
        });
        checkBoxes.forEach((box) => {
            box.classList.add("checked");
        });
    }
});

// 개인정보수집, 결제대행 체크박스 클릭 시
checkBoxes.forEach((div, i) => {
    div.addEventListener("click", () => {
        if (agreeCheck[i].checked) {
            agreeCheck[i].checked = false;
            checkBoxes[i].classList.remove("checked");
        } else {
            agreeCheck[i].checked = true;
            checkBoxes[i].classList.add("checked");
        }

        if (agreeCheck[0].checked && agreeCheck[1].checked) {
            allCheckBox.classList.add("checked");
            totalCheck.checked = true;
        } else {
            allCheckBox.classList.remove("checked");
            totalCheck.checked = false;
        }
    });
});

// 개인정보수집, 결제대행 텍스트 클릭 시
agreeDivs.forEach((div, i) => {
    div.addEventListener("click", () => {
        if (agreeCheck[i].checked) {
            agreeCheck[i].checked = false;
            checkBoxes[i].classList.remove("checked");
        } else {
            agreeCheck[i].checked = true;
            checkBoxes[i].classList.add("checked");
        }

        if (agreeCheck[0].checked && agreeCheck[1].checked) {
            allCheckBox.classList.add("checked");
            totalCheck.checked = true;
        } else {
            allCheckBox.classList.remove("checked");
            totalCheck.checked = false;
        }
    });
});

// checkBoxes.forEach((checkBox) => {
//   checkBox.addEventListener("click", (e) => {
//     if (checkBox.classList.contains("checked")) {
//       checkBox.classList.remove("checked");
//       allCheckBox.classList.remove("checked");
//     } else {
//       checkBox.classList.add("checked");
//     }

//     if (console.log(checkBox.classList.contains("checked")) === "ture") {
//       allCheckBox.classList.add("checked");
//     }
//   });
// });

// const all = document.querySelector("input.all");
// const terms = document.querySelectorAll("input.term");

// termAll.addEventListener("click", (e) => {
//   checkBoxes.forEach((checkBox) => {
//     checkBox.checked = e.target.checked;
//   });
// });

// terms.forEach((term) => {
//   term.addEventListener("click", (e) => {
//     all.checked = terms.filter((term) => term.checked).length === 3;
//   });
// });

summitBtn.addEventListener("click", () => {
    const productName = document.querySelector("p.product-name").innerText;
    // 유효성 검사 후 아래 코드로
    BootPay.request({
        price: '1000',
        application_id: "65f3f21e00c78a001a64ad75",
        name: `${productName}`,
        pg: 'danal',
        items: [
            {
                item_name: `${productName}`,
                qty: 1, // 수량 직접 넣어야함
                unique: '123',
                price: 1000, // 가격 직접 넣어야함
            }
        ],
        order_id: '고유order_id_1234',
    }).error(function (data) {
        //결제 진행시 에러가 발생하면 수행됩니다.
        console.log(data);
    }).cancel(function (data) {
        //결제가 취소되면 수행됩니다.
        console.log(data);
    }).ready(function (data) {
        // 가상계좌 입금 계좌번호가 발급되면 호출되는 함수입니다.
        console.log(data);
    }).confirm(function (data) {
        //결제가 실행되기 전에 수행되며, 주로 재고를 확인하는 로직이 들어갑니다.
        //주의 - 카드 수기결제일 경우 이 부분이 실행되지 않습니다.
        console.log(data);
        var enable = true; // 재고 수량 관리 로직 혹은 다른 처리
        if (enable) {
            BootPay.transactionConfirm(data); // 조건이 맞으면 승인 처리를 한다.
        } else {
            BootPay.removePaymentWindow(); // 조건이 맞지 않으면 결제 창을 닫고 결제를 승인하지 않는다.
        }
    }).close(function (data) {
        // 결제창이 닫힐때 수행됩니다. (성공,실패,취소에 상관없이 모두 수행됨)
        console.log(data);
    }).done(async function (data) {
        ////////////////////////
        // 결제 완료 시의 로직 작성
        const receiptId = await data.receipt_id;
        pay(receiptId);
    });
})

const pay = (receiptId) => {
    // 결제하는 순간 화면에 있는 데이터들을 각각 받아오든, form태그가 있으면 그걸 가져오든 해서
    // view로 보내면 됨.
    // 1. form태그에 csrf token 넣어놓기
    // 2. 적절한 view 링크로 action 속성값 넣기
    // 3. 다 해놨으면 밑에 alert 대신 form.submit()
    alert('결제 완료')
}