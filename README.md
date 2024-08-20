# 서울특별시 교육 공공서비스예약

<img width="1021" alt="화면 캡처 2024-08-20 092015" src="https://github.com/user-attachments/assets/1e0ff8cb-d8fb-4c55-a14e-f87ca75a5da5">

### 웹 사이트의 제작의 목적은?

서울특별시 교육 공공서비스를 안내하고 빠르게 예약할 수 있도록 돕는 것입니다.

---

### 사용자에게 제공하려는 핵심 서비스는?

사용자에게 교육 공공서비스의 상세 내용을 안내하는 것입니다.

---

### 활용 API URL

https://data.seoul.go.kr/dataList/OA-2268/S/1/datasetView.do

https://apis.map.kakao.com/

---

### 1개의 item sample

```
"ListPublicReservationCulture": {
    "list_total_count": 770,
    "RESULT": {
    "CODE": "INFO-000",
    "MESSAGE": "정상 처리되었습니다"
    },
    "row": [
    {
        "GUBUN": "자체",
        "SVCID": "S240213150826952780",
        "MAXCLASSNM": "문화체험",
        "MINCLASSNM": "교육체험",
        "SVCSTATNM": "접수종료",
        "SVCNM": "2024년 <느낌 있는 박물관> 교육생 모집 안내",
        "PAYATNM": "무료",
        "PLACENM": "서울역사박물관",
        "USETGTINFO": " 장애인(중고등학교 특수학급 단체)",
        "SVCURL": "https://yeyak.seoul.go.kr/web/reservation/selectReservView.do?rsv_svc_id=S240213150826952780",
        "X": "126.97037430869801",
        "Y": "37.570500279648634",
        "SVCOPNBGNDT": "2024-04-03 00:00:00.0",
        "SVCOPNENDDT": "2024-11-21 00:00:00.0",
        "RCPTBGNDT": "2024-02-15 10:00:00.0",
        "RCPTENDDT": "2024-03-15 17:00:00.0",
        "AREANM": "종로구",
        "IMGURL": "https://yeyak.seoul.go.kr/web/common/file/FileDown.do?file_id=1708587459850DATOW92X2UBMKCTKJU85WVIEL",
        "DTLCONT": " 1. 공공시설 예약서비스 이용시 필수 준수사항 모든 서비스의 이용은 담당 기관의 규정에 따릅니다. 각 시설의 규정 및 허가조건을 반드시 준수하여야 합니다. 각 관리기관의 시설물과 부대시설을 이용함에 있어 담당자들과 협의 후 사용합니다. 각 관리기관의 사고 발생시 서울시청에서는 어떠한 책임도 지지않습니다. 시설이용료 납부는 각 관리기관에서 규정에 준 합니다. 본 사이트와 각 관리기관의 규정을 위반할시에는 시설이용 취소 및 시설이용 불허의 조치를 취할 수 있습니다. 접수시간을 기준으로 브라우저에서 새로고침을 하면 변경된 정보를 볼 수 있습니다. 2. 시설예약 비회원일 경우에는 실명 확인을 통하여 사용하실 수 있으며 서울시 통합 회원에 가입 하시게 되면 서울시에서 제공하는 다양하고 많은 혜택을 받으실 수 있습니다. 3. 상세내용 4. 주의사항 ★&nbsp; 교육 희망일자 하루만 선택 가능 ※ 특수학급의 특성상 교육인원 (15명 이내)이 미달일 경우 두 학급을 연합 구성하여 신청 ★&nbsp; 기관에서 박물관까지 왕복차량 제공 ※ 본 교육은 장애인 대상 교육으로 일반 학급은 신청하실 수 없습니다. ",
        "TELNO": "02-724-0198, 0196",
        "V_MIN": "10:00",
        "V_MAX": "16:00",
        "REVSTDDAYNM": "접수종료일",
        "REVSTDDAY": "1"
    }]
}
```

---

### 주요 기능

- 교육 공공서비스 예약의 서비스명, 지역명으로 검색기능 제공

- 카테고리별 분류 기능 제공

- 각 데이터의 서비스 상태, 이미지, 서비스명, 서비스 대상, 장소, URL 등 상세 정보 제공

- 지도로 해당 서비스 장소 확인 가능

---

### UI 디자인

https://www.figma.com/design/YAJQURZg82WWhZElTCZECN/7%ED%8C%80-%EC%95%BD%EC%8B%9D%EA%B8%B0%ED%9A%8D%EC%84%9C?node-id=0-1&t=eh8tiIslEQVdWQzO-1

---

### 트러블 슈팅

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
