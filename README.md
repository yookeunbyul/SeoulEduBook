# 🗓️ 서울특별시 교육 공공서비스예약

<img width="1021" alt="화면 캡처 2024-08-20 092015" src="https://github.com/user-attachments/assets/1e0ff8cb-d8fb-4c55-a14e-f87ca75a5da5">

<br />

## ✍🏻 요약
서울특별시 교육 공공서비스예약 정보 API를 활용하여 현재 진행되고 있는 교육 공공서비스를 안내하고 지도 상에서 서비스를 진행하는 장소를 볼 수 있는 서비스입니다.

#### 🔗 활용 API URL

- https://data.seoul.go.kr/dataList/OA-2268/S/1/datasetView.do

- https://apis.map.kakao.com/

#### ⚙️ 기술 스택

- `JavaScript`, `HTML`, `CSS`, `swiper`

<br />

## ✍🏻 주요 기능

#### 1. 교육 공공서비스 예약의 서비스명, 지역명으로 검색기능 제공
✅ **서비스명은 input box로, 지역명은 select box로 나눠서 검색할 수 있습니다.**
<img width="1268" alt="화면 캡처 2024-09-24 164256" src="https://github.com/user-attachments/assets/42469c2f-4fec-460e-8889-4e80fea47d0d">

#### 2. 카테고리별 분류 기능 제공
✅ **swiper 라이브러리를 사용하여 카테고리를 슬라이더로 보여줍니다.**

✅ **버튼을 클릭하면 해당 카테고리에 해당하는 교육 공공 서비스가 나타납니다.**

<br />

<img width="1052" alt="화면 캡처 2024-09-24 164341" src="https://github.com/user-attachments/assets/f8e1ca90-6c87-472e-97d7-17ad45694f9f">

#### 3. 각 데이터의 서비스 상태, 이미지, 서비스명, 서비스 대상, 서비스 날짜, 장소, URL 등 상세 정보 제공
<img width="1144" alt="화면 캡처 2024-09-24 164430" src="https://github.com/user-attachments/assets/7705902f-708d-4c87-9bb9-3b284f0543b8">

#### 4. 지도로 해당 서비스 장소 확인 가능
<div align="center">
  <img width="622" alt="화면 캡처 2024-09-24 164516" src="https://github.com/user-attachments/assets/bebb04ad-4b1b-46ca-bfdf-e86dd00411f0">
</div>

#### 5. 반응형
✅ **상세정보는 모달을 통해 확인할 수 있습니다.**
<div align="center">
  <img width="352" alt="화면 캡처 2024-09-24 164548" src="https://github.com/user-attachments/assets/c365c917-9690-4906-9937-4081ac8d9ed4">
  <img width="356" alt="화면 캡처 2024-09-24 165915" src="https://github.com/user-attachments/assets/a4643030-1067-4648-bf91-9eba73c47dec">
</div>

<br />

## ✍🏻 주요 코드 정리
✅ **과도한 API 요청을 막기 위해 클릭 후 일정 시간동안은 API 요청 전송을 지연하게끔 debounce를 사용했습니다.**
```
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    //이전에 설정된 타이머 초기화
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
```
✅ **fetch로 API 요청을 받아올 때, try-catch문을 사용하여 에러 처리를 하였습니다.**
```
const url = `http://openAPI.seoul.go.kr:8088/${API_KEY}/json/ListPublicReservationEducation/`;

const searchParams = {
  pageBegin: (page - 1) * pageSize + 1,
  pageEnd: page * pageSize,
  minclass: "", // category
  svcname: "",
  target: "", // not use
  area: "",
};

let serviceDetailList = {};
let serviceLinkList = {};
let serviceXList = {};
let serviceYList = {};

let selectItem = "";
let searchValue = "";

const fetchList = async () => {
  //""이 falsy한 값이라 "%20"
  const newUrl =
    url +
    Object.values(searchParams)
      .map((param) => param || "%20")
      .join("/");

  console.log(newUrl);

  try {
    let serviceList = [];
    const res = await fetch(newUrl);
    const data = await res.json();

    totalResults = data.ListPublicReservationEducation.list_total_count;
    serviceList = data.ListPublicReservationEducation.row;

    console.log(data.ListPublicReservationEducation.row);

    serviceList.forEach((service) => {
      serviceDetailList[service.SVCID] = service.DTLCONT;
      serviceLinkList[service.SVCID] = service.SVCURL;
      serviceXList[service.SVCID] = service.X;
      serviceYList[service.SVCID] = service.Y;
    });
    renderList(serviceList);
    document.querySelector(".pagination").classList.remove("hidden");
    pagination();
  } catch (e) {
    console.error(e);
    //리스트가 없는 경우 처리?
    document.getElementById("listCon").innerHTML = `
      <div class='error'><p>검색결과가 없습니다.</p></div>
      `;
    document.querySelector(".pagination").classList.add("hidden");
  }
};
```

<br />

## ✍🏻 트러블 슈팅

- 08/16 : Uncaught SyntaxError: Cannot use import statement outside a module

  ```
  원인
  HTML에서 JavaScript를 로드할 때, <script> 태그에 type="module" 속성이 없으면 JavaScript가 일반 스크립트로 간주됩니다.
  이 경우, import와 export 문을 사용할 수 없습니다.

  해결 방법
  <script type="module" src="./common.js" defer></script>
  type="module"을 적어줍니다.
  ```

- 08/18 : Uncaught ReferenceError: movePage is not defined;

  ```
  원인
  이 문제는 주로 JavaScript 모듈(import/export)을 사용하는 경우 발생합니다.
  모듈 시스템에서는 JavaScript 코드를 기본적으로 모듈 범위로 보호하여, 각 모듈에서 정의된 변수나 함수는 다른 스크립트나 전역 범위에서 접근할 수 없습니다.

  해결 방법
  movePage 함수를 HTML에서 사용할 수 있도록 하기 위해, 함수가 전역 범위에 노출되도록 해야 합니다.

  //movePage 함수를 window 객체에 추가
  window.movePage = movePage;

  함수를 window 객체에 할당하면 전역 범위에서 접근할 수 있게 됩니다.
  ```

- 08/19 : kakao.js:121 Uncaught TypeError: a.Lf is not a function

  ```
  원인
  map = new kakao.maps.Map(mapContainer, mapOption);
  이 코드를 함수 안에 넣어서 컨트롤이 map에 접근 못하는 오류입니다.

  해결 방법
  전역 변수로 설정하면 해결할 수 있습니다.
  ```
