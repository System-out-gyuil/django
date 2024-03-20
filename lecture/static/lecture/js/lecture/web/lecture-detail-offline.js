const days = document.querySelectorAll(".weekday-selection");
const timeSection = document.querySelector(".product-option-second-wrap");
const inputTarget = document.querySelector(".selected-product-name");
const sidebarInputTarget = document.querySelector(
  ".sidebar-selected-product-option"
);

days.forEach((day) => {
  day.addEventListener("click", (e) => {
    // 모든 요일에서 clicked 클래스를 제거
    days.forEach((otherday) => {
      otherday.classList.remove("clicked");
    });
    // 클릭된 요일에만 clicked 클래스 추가
    day.classList.add("clicked");
    const selectedDay = day.querySelector("span").textContent;
    var inner = inputTarget.querySelector(".selected-date");
    var sidebarInner = sidebarInputTarget.querySelector(".selected-date");
    inner.innerHTML = `${selectedDay}`;
    sidebarInner.innerHTML = `${selectedDay}`;
    // 시간 섹션을 보이거나 숨김
    if (day.classList.contains("clicked")) {
      timeSection.style.display = "block";
    } else {
      timeSection.style.display = "none";
    }
  });
});

// 시간 선택 시 색 변하게
const times = document.querySelectorAll(".time-selection");
const check = document.querySelector(".selected-product-list-container");
const sidebarselectBox = document.querySelector(
  ".sidebar-selected-product-wrap"
);
times.forEach((time) => {
  time.addEventListener("click", (e) => {
    // 모든 시간 요소에서 clicked 클래스를 제거
    times.forEach((othertime) => {
      othertime.classList.remove("clicked");
    });

    // 클릭된 시간에만 clicked 클래스 추가
    time.classList.add("clicked");
    const selectedTime = time.querySelector("span").textContent;
    var inner = inputTarget.querySelector(".selected-time");
    var sidebarInner = sidebarInputTarget.querySelector(".selected-time");
    inner.innerHTML = `${selectedTime}`;
    sidebarInner.innerHTML = `${selectedTime}`;
    // 체크 요소를 보이거나 숨김
    if (time.classList.contains("clicked")) {
      check.style.display = "block";
      sidebarselectBox.style.display = "block";
    } else {
      check.style.display = "none";
      sidebarselectBox.style.display = "none";
    }
  });
});

// 인원 가감
const number = document.querySelector(".counted-number");
const add = document.querySelector(".add-count");
const sub = document.querySelector(".sub-count");
const studentInfo = document.querySelector(".student-info-inner");
const sidebarNumber = document.querySelector(".sidebar-count-number");
const sidebarAdd = document.querySelector(".sidebar-add-count");
const sidebarSub = document.querySelector(".sidebar-sub-count");
const studentName = document.querySelector(".selected-student-list-wrap");
const price = document.querySelector(".total-price");
const sidebarPrice = document.querySelector(".sidebar-total-price");
const studentAlert = document.querySelector(".student-count-title");
const sidebarAlert = document.querySelector(".sidebar-student-count-title");
const sidebarSelected = document.querySelector(
  ".sidebar-selected-product-container"
);


var count = 0;
var totalPrice = 0; // 추가된 총 가격
const kitInputValue = document.querySelector(".kt-count-btn");

// 총 가격을 업데이트하는 함수
function updateTotalPrice() {
  price.innerText = document.querySelector(".selected-price").innerText;
  sidebarPrice.innerText = document.querySelector(".selected-price").innerText;
  totalPrice = count * parseInt(price.innerText);
  price.innerText = totalPrice + '원'; // 총 가격을 화면에 업데이트
  sidebarPrice.innerText = totalPrice + '원'; // 총 가격을 화면에 업데이트
}

// add 클릭 이벤트 핸들러
add.addEventListener("click", (e) => {
  if (count < 5) {
    count++;
    updateTotalPrice(); // 수정된 부분: 총 가격 업데이트
    count === 0
      ? (studentName.style.display = "none")
      : (studentName.style.display = "block");

    // 예약자 정보 및 입력 칸 추가
    const infoListWrap = document.createElement('div');
    infoListWrap.classList.add('info-list-wrap');

    const studentLabel = document.createElement('div');
    studentLabel.classList.add('student-label');
    studentLabel.innerHTML = `
      <div>예약자</div> <div>${count}</div>
    `;

    const input = document.createElement('input');
    input.classList.add('student-name-input');
    input.placeholder = "예약자 이름을 입력하세요";
    input.name = "name-input";

    infoListWrap.appendChild(studentLabel);
    infoListWrap.appendChild(input);
    studentInfo.appendChild(infoListWrap);

    number.innerHTML = `${count}`;
    sidebarNumber.innerHTML = `${count}`;
    kitInputValue.value = `${count}`;
    if (count >= 5) {
      studentAlert.innerHTML += `
        <div class="student-alert">
          <div>최대 예약인원은 ${count}명입니다.</div>
        </div>`;
      sidebarAlert.innerHTML += `
        <div class="student-alert">
          <div>최대 예약인원은 ${count}명입니다.</div>
        </div>`;
    }
  }
});

sub.addEventListener("click", (e) => {
  count == 0 ? (count = 0) : count--;
  updateTotalPrice(); // 총 가격 업데이트
  number.innerHTML = `${count}`;
  sidebarNumber.innerHTML = `${count}`;
  var target = studentInfo.querySelectorAll(".info-list-wrap");
  target[count].remove();
  var removeTarget = studentAlert.querySelector(".student-alert");
  var sidebarTarget = sidebarAlert.querySelector(".student-alert");
  removeTarget && removeTarget.remove();
  sidebarTarget && sidebarTarget.remove();
});

sidebarAdd.addEventListener("click", (e) => {
  if (count < 5) {
    count++;
    updateTotalPrice(); // 총 가격 업데이트
    count === 0
      ? (studentName.style.display = "none")
      : (studentName.style.display = "block");
    studentInfo.innerHTML += `
    <div class="info-list-wrap">
      <div class="student-label">
        <div>예약자</div> <div>${count}</div>
      </div>
        <input
          class="student-name-input"
          placeholder="예약자 이름을 입력하세요"
          name="price-input"
        />
    </div>`;
    number.innerHTML = `${count}`;
    sidebarNumber.innerHTML = `${count}`;
    if (count >= 5) {
      studentInfo.innerHTML += `
      <div class="info-list-wrap">
      <div class="student-alert">
        <div>최대 예약인원은 ${count}명입니다.</div>
      </div>
    </div>`;
    }
  }
});

sidebarSub.addEventListener("click", (e) => {
  count == 0 ? (count = 0) : count--;
  updateTotalPrice(); // 총 가격 업데이트
  number.innerHTML = `${count}`;
  sidebarNumber.innerHTML = `${count}`;
  var target = studentInfo.querySelectorAll(".info-list-wrap");
  target[count].remove();
  var studentAlert = studentInfo.querySelector(".student-alert");
  studentAlert && studentAlert.remove();
});

const orderButton = document.querySelector(".order-button");
const addCartButton = document.querySelector(".add-cart-button");
const orderForm = document.querySelector("form[name=apply]");
orderButton.addEventListener("click", () => {
  orderForm.action = '/lecture/detail/offline/';
  orderForm.submit();
})

const addToCart = async (cartForm) => {
  await fetch(`/lecture/cart/api/`, {
    method: "POST",
    body: cartForm,
  });
}

addCartButton.addEventListener("click", async () => {
  const cartForm = new FormData(orderForm);
  await addToCart(cartForm);
  // 모달로 변경하려면 변경
  alert('장바구니에 상품이 추가되었습니다.');
})