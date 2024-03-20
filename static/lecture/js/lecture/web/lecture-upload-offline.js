// 지역 별 세부지역을 담을 배열들 - 주소지 파트에서 사용
// 서울특별시 내 세부지역
const seoulList = [
  "종로구",
  "중구",
  "용산구",
  "성동구",
  "광진구",
  "동대문구",
  "중랑구",
  "성북구",
  "강북구",
  "도봉구",
  "노원구",
  "은평구",
  "서대문구",
  "마포구",
  "양천구",
  "강서구",
  "구로구",
  "금천구",
  "영등포구",
  "동작구",
  "관악구",
  "서초구",
  "강남구",
  "송파구",
  "강동구",
];

// 부산광역시 내 세부지역
const busanList = [
  "중구",
  "서구",
  "동구",
  "영도구",
  "부산진구",
  "동래구",
  "남구",
  "북구",
  "해운대구",
  "사하구",
  "금정구",
  "강서구",
  "연제구",
  "수영구",
  "사상구",
  "기장군",
];

// 대구광역시 내 세부지역
const daeguList = [
  "중구",
  "동구",
  "서구",
  "남구",
  "북구",
  "수성구",
  "달서구",
  "달성군",
];

// 인천광역시 내 세부지역
const incheonList = [
  "중구",
  "동구",
  "남구",
  "미추홀구",
  "연수구",
  "남동구",
  "부평구",
  "계양구",
  "서구",
  "강화군",
  "옹진군",
];

// 광주광역시 내 세부지역
const gwangjuList = ["동구", "서구", "남구", "북구", "광산구"];

// 대전광역시 내 세부 지역
const daejeonList = ["동구", "중구", "서구", "유성구", "대덕구"];

// 울산광역시 내 세부지역
const ulsanList = ["중구", "남구", "동구", "북구", "울주군"];

// 세종특별자치시 내 세부지역
const sejongList = [
  "조치원읍",
  "금남면",
  "부강면",
  "소정면",
  "연기면",
  "연동면",
  "연서면",
  "장군면",
  "전동면",
  "전의면",
  "고운동",
  "다정동",
  "대평동",
  "도담동",
  "반곡동",
  "보람동",
  "새롬동",
  "소담동",
  "아름동",
  "종촌동",
  "한솔동",
  "해밀동",
];

// 경기도 내 세부지역
const gyeonggiList = [
  "수원시",
  "성남시",
  "고양시",
  "용인시",
  "부천시",
  "안산시",
  "안양시",
  "남양주시",
  "화성시",
  "평택시",
  "의정부시",
  "시흥시",
  "파주시",
  "광명시",
  "김포시",
  "군포시",
  "광주시",
  "이천시",
  "양주시",
  "오산시",
  "구리시",
  "안성시",
  "포천시",
  "의왕시",
  "하남시",
  "여주시",
  "여주군",
  "양평군",
  "동두천시",
  "과천시",
  "가평군",
  "연천군",
];

// 강원도 내 세부지역
const gangwonList = [
  "춘천시",
  "원주시",
  "강릉시",
  "동해시",
  "태백시",
  "속초시",
  "삼척시",
  "홍천군",
  "횡성군",
  "영월군",
  "평창군",
  "정선군",
  "철원군",
  "화천군",
  "양구군",
  "인제군",
  "고성군",
  "양양군",
];

// 충청북도 내 세부지역
const chungBukList = [
  "청주시",
  "충주시",
  "제천시",
  "청원군",
  "보은군",
  "옥천군",
  "영동군",
  "진천군",
  "괴산군",
  "음성군",
  "단양군",
  "증평군",
];

// 충청북도 내 세부지역
const chungNamList = [
  "천안시",
  "공주시",
  "보령시",
  "아산시",
  "서산시",
  "논산시",
  "계룡시",
  "당진시",
  "당진군",
  "금산군",
  "연기군",
  "부여군",
  "서천군",
  "청양군",
  "홍성군",
  "예산군",
  "태안군",
];

// 전라북도 내 세부지역
const jeonBukList = [
  "전주시",
  "군산시",
  "익산시",
  "정읍시",
  "남원시",
  "김제시",
  "완주군",
  "진안군",
  "무주군",
  "장수군",
  "임실군",
  "순창군",
  "고창군",
  "부안군",
];

// 전라북도 내 세부지역
const jeonNamList = [
  "목포시",
  "여수시",
  "순천시",
  "나주시",
  "광양시",
  "담양군",
  "곡성군",
  "구례군",
  "고흥군",
  "보성군",
  "화순군",
  "장흥군",
  "강진군",
  "해남군",
  "영암군",
  "무안군",
  "함평군",
  "영광군",
  "장성군",
  "완도군",
  "진도군",
  "신안군",
];

// 경상북도 내 세부지역
const gyeongBukList = [
  "포항시",
  "경주시",
  "김천시",
  "안동시",
  "구미시",
  "영주시",
  "영천시",
  "상주시",
  "문경시",
  "경산시",
  "군위군",
  "의성군",
  "청송군",
  "영양군",
  "영덕군",
  "청도군",
  "고령군",
  "성주군",
  "칠곡군",
  "예천군",
  "봉화군",
  "울진군",
  "울릉군",
];

// 경상남도 내 세부지역
const gyeongNamList = [
  "창원시",
  "마산시",
  "진주시",
  "진해시",
  "통영시",
  "사천시",
  "김해시",
  "밀양시",
  "거제시",
  "양산시",
  "의령군",
  "함안군",
  "창녕군",
  "고성군",
  "남해군",
  "하동군",
  "산청군",
  "함양군",
  "거창군",
  "합천군",
];

// 제주특별자치도 내 세부지역
const jejuList = ["제주시", "서귀포시", "북제주군", "남제주군"];

// 각 드롭박스 객체 가져옴
// 앞쪽 드롭박스(시/도)
const regionDropbox = document.querySelector(
  ".info-dropdown-box .product-index-local"
);

// 뒤쪽 드롭박스(세부 지역)
const areaDropbox = document.querySelector(
  ".info-dropdown-box .product-index-control"
);

// 앞쪽 드롭박스 - change 이벤트(값이 바뀌면 발생)
regionDropbox.addEventListener("change", (e) => {
  // 드롭박스의 값이 바뀔 때마다 현재 선택한 요소를 변수에 할당
  let selectedRegion = e.target.options[e.target.selectedIndex].value;

  // 아래의 switch-case 문에 따라 서로 다른 값(배열)을 받을 변수도 선언
  let detailedArea = [];

  // 선택한 지역에 따라 서로 다른 배열(세부 지역) 할당
  switch (selectedRegion) {
    case "서울특별시":
      detailedArea = seoulList;
      break;

    case "인천광역시":
      detailedArea = incheonList;
      break;

    case "대전광역시":
      detailedArea = daejeonList;
      break;

    case "세종특별자치시":
      detailedArea = sejongList;
      break;

    case "광주광역시":
      detailedArea = gwangjuList;
      break;

    case "부산광역시":
      detailedArea = busanList;
      break;

    case "대구광역시":
      detailedArea = daeguList;
      break;

    case "울산광역시":
      detailedArea = ulsanList;
      break;

    case "제주특별자치도":
      detailedArea = jejuList;
      break;

    case "경기도":
      detailedArea = gyeonggiList;
      break;

    case "강원도":
      detailedArea = gangwonList;
      break;

    case "충청북도":
      detailedArea = chungBukList;
      break;

    case "충청남도":
      detailedArea = chungNamList;
      break;

    case "전라북도":
      detailedArea = jeonBukList;
      break;

    case "전라남도":
      detailedArea = jeonNamList;
      break;

    case "경상북도":
      detailedArea = gyeongBukList;
      break;

    case "경상남도":
      detailedArea = gyeongNamList;
      break;
  }

  // 아래의 forEach문을 돌리기 전에
  // 뒤쪽 드롭박스에 들어갈 html이 담길 변수 선언 및 초기화
  let resultHTML = ``;

  // 위에서 선택된 각 지역 별 세부 지역 리스트 순회
  detailedArea.forEach((area) => {
    // resultHTML에 쌓일 문자열(html 문법) 생성
    let areaOption = `<option value=${area}>${area}</option>`;

    // resultHTML에 위 html 구문을 하나씩 추가
    resultHTML += areaOption;
  });

  // 뒤쪽 드롭박스의 내용을 완성된 resultHTML로 교체
  areaDropbox.innerHTML = resultHTML;
});