const items = document.querySelectorAll(".list-inner-box");

items.forEach((item) => {
  const item1 = item.querySelector("h3.list-inner");
  const item2 = item.querySelector("span.question-text");
  const item3 = item.querySelector("span.question-v");
  const item4 = item.querySelector("div.question");

  item.addEventListener("click", (e) => {
    item1.classList.toggle("list-inner-open");
    item2.classList.toggle("question-text-open");
    item3.classList.toggle("question-v-open");
    item4.classList.toggle("question-open");
  });
});

// 공지사항, Q&A 눌렀을때 버튼 색이 바뀜
const qnaButton = document.getElementById("Q&A");
const noticeButton = document.getElementById("공지사항");

// Q&A 버튼을 클릭했을 때의 이벤트 처리 함수를 정의
qnaButton.addEventListener("click", function () {
  if (qnaButton.checked) {
    noticeButton.checked = false;
  }
  qnaButton.parentElement.classList.add("benner-inner-checked");
  noticeButton.parentElement.classList.remove("benner-inner-checked");
});

// 공지사항 버튼을 클릭했을 때의 이벤트 처리 함수를 정의
noticeButton.addEventListener("click", function () {
  if (noticeButton.checked) {
    qnaButton.checked = false;
  }
  noticeButton.parentElement.classList.add("benner-inner-checked");
  qnaButton.parentElement.classList.remove("benner-inner-checked");
});
