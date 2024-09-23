# 🗓️ 서울특별시 교육 공공서비스예약

<img width="1021" alt="화면 캡처 2024-08-20 092015" src="https://github.com/user-attachments/assets/1e0ff8cb-d8fb-4c55-a14e-f87ca75a5da5">

<br />

## ✍🏻 요약
서울특별시 교육 공공서비스예약 정보 API를 활용하여 현재 진행되고 있는 교육 공공서비스를 안내하고 지도 상에서 서비스를 진행하는 장소를 볼 수 있는 서비스입니다.

#### 🔗 활용 API URL

- https://data.seoul.go.kr/dataList/OA-2268/S/1/datasetView.do

- https://apis.map.kakao.com/

#### ⚙️ 기술 스택

- `JavaScript`, `HTML`, `CSS`

<br />

## ✍🏻 주요 기능

#### 1. 교육 공공서비스 예약의 서비스명, 지역명으로 검색기능 제공

#### 2. 카테고리별 분류 기능 제공

#### 3. 각 데이터의 서비스 상태, 이미지, 서비스명, 서비스 대상, 장소, URL 등 상세 정보 제공

#### 4. 지도로 해당 서비스 장소 확인 가능

#### 5. 반응형

<br />

## 트러블 슈팅

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
