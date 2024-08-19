import config from "./config.js";
const { API_KEY } = config;

//--------
//swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 8,
  spaceBetween: 15,
});

//--------
//kakao map
let mainMap;
let mobileMap;
let marker;

var mainMapContainer = document.getElementById("mainMap");
var MobileMapContainer = document.getElementById("mobileMap");

var mainMapOption = {
  center: new kakao.maps.LatLng(37.5665, 126.978),
  level: 3,
};
var mobileMapOption = {
  center: new kakao.maps.LatLng(37.5665, 126.978),
  level: 5,
};

mainMap = new kakao.maps.Map(mainMapContainer, mainMapOption);
mobileMap = new kakao.maps.Map(MobileMapContainer, mobileMapOption);

function panTo(lat, lon) {
  // 이동할 위도 경도 위치를 생성합니다
  var moveLatLon = new kakao.maps.LatLng(lat, lon);

  // 지도 중심을 부드럽게 이동시킵니다
  // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
  mainMap.panTo(moveLatLon);
  mobileMap.panTo(moveLatLon);
}

function makeMarker(lat, lon) {
  // 기존 마커가 있다면 지도에서 제거합니다
  if (marker) {
    marker.setMap(null);
  }

  // 마커가 표시될 위치입니다
  var markerPosition = new kakao.maps.LatLng(lat, lon);

  // 마커를 생성합니다
  marker = new kakao.maps.Marker({
    position: markerPosition,
  });

  // 마커가 지도 위에 표시되도록 설정합니다
  marker.setMap(mainMap);
}

function mobileMakeMarker(lat, lon) {
  if (marker) {
    marker.setMap(null);
  }
  var markerPosition = new kakao.maps.LatLng(lat, lon);
  marker = new kakao.maps.Marker({
    position: markerPosition,
  });
  marker.setMap(mobileMap);
}

//--------
// ui
const $logo = document.getElementById("logo");
const $menuAll = document.querySelector(".menuAll");
//[모바일] 햄버거 메뉴(카테고리 영역)
const $hamberMenu = document.querySelector(".hamberMenu");
//[모바일] 햄버거 메뉴 버튼
const $menuBtn = document.querySelector(".menuBtn");
//[모바일] 닫기 버튼
const $closeImgBtn = document.querySelector(".closeImgBtn");

const $listCon = document.getElementById("listCon");
const $mobileDetail = document.querySelector(".mobileDetail");
const $closeMapBtn = document.querySelector(".closeMapBtn");

const slides = document.querySelectorAll(".swiper-slide");
const menuAllBtns = document.querySelectorAll(".menuAllBtn");
const hamberMenuBtns = document.querySelectorAll(".hamberMenuBtn");
const $list = document.querySelector(".list");

const $searchBtn = document.querySelector(".searchBtn");
const $locaSelect = document.querySelector(".locaSelect");
const $searchInput = document.querySelector(".searchInput");

function handleLogoClick(e) {
  //로고를 클릭하면 새로고침을 막고 로고를 돌린 후 전체 카테고리 show
  e.preventDefault();
  $logo.classList.toggle("rotate");
  $menuAll.classList.toggle("show");
}

function handleMenuToggle() {
  //햄버거 메뉴 열고 닫기
  $hamberMenu.classList.toggle("show");
}

const handleMapToggle = () => {
  $mobileDetail.classList.toggle("show");
};

function addDetail() {
  document.querySelector(".detailCon").classList.add("show");
  document.querySelector(".reserCon").classList.add("show");
}

function removeDetail() {
  document.querySelector(".detailCon").classList.remove("show");
  document.querySelector(".reserCon").classList.remove("show");
}

function checkScreenSize() {
  const screenWidth = window.innerWidth;

  //이벤트 리스너 중복 제거
  $logo.removeEventListener("click", handleLogoClick);
  $menuBtn.removeEventListener("click", handleMenuToggle);
  $closeImgBtn.removeEventListener("click", handleMenuToggle);
  $closeMapBtn.removeEventListener("click", handleMapToggle);

  if (screenWidth <= 768) {
    //768보다 같거나 작으면
    //연 상태로 작아지면 다 제거
    $logo.classList.remove("rotate");
    $menuAll.classList.remove("show");
    $hamberMenu.classList.remove("show");

    //리스트 내부 스크롤을 상단으로 이동
    $list.scrollTop = 0;

    removeDetail();

    $menuBtn.addEventListener("click", handleMenuToggle);
    $closeImgBtn.addEventListener("click", handleMenuToggle);
    $closeMapBtn.addEventListener("click", handleMapToggle);
  } else {
    //크면
    $logo.addEventListener("click", handleLogoClick);
    //연 상태로 커지면 제거
    $hamberMenu.classList.remove("show");
    $mobileDetail.classList.remove("show");

    //리스트 내부 스크롤을 상단으로 이동
    $list.scrollTop = 0;

    panTo(37.5665, 126.978);
    if (marker) {
      marker.setMap(null);
    }
  }
}

function extractDetails(htmlString) {
  const startTag = "<p>3. 상세내용</p>";
  const endTag = "<p>4. 주의사항</p>";

  //시작 태그의 위치를 찾습니다.
  const startIndex = htmlString.indexOf(startTag);
  if (startIndex === -1) return ""; //시작 태그가 없으면 빈 문자열 반환

  //시작 태그 이후의 위치로 이동합니다.
  const startContentIndex = startIndex + startTag.length;

  //종료 태그의 위치를 찾습니다.
  //indexOf(searchElement, fromIndex)
  const endIndex = htmlString.indexOf(endTag, startContentIndex);
  if (endIndex === -1) return ""; // 종료 태그가 없으면 빈 문자열 반환

  //두 태그 사이의 내용을 추출합니다.
  let extractedContent = htmlString.slice(startContentIndex, endIndex).trim();

  //정규식을 사용하여 모든 <img> 태그를 제거합니다.
  extractedContent = extractedContent.replace(/<img[^>]*>/g, "");

  //태그를 제거하고 텍스트만 추출
  const plainText = extractedContent
    .replace(/<\/?[^>]+(>|$)/g, "") //모든 HTML 태그 제거
    .replace(/&nbsp;/g, " ") //&nbsp;를 공백으로 변환
    .replace(/&crarr;/g, " ") //&crarr;를 공백으로 변환
    .trim();

  //텍스트를 평범한 <p> 태그로 감싸기
  let paragraphs = plainText
    .split(/\n+/)
    .map((line) => `<p>${line.trim()}</p>`)
    .join("\n");

  if (paragraphs === `<p></p>`) {
    paragraphs = `<p>상세내용은 사이트로 이동하여 확인해주세요.</p>`;
  }

  return paragraphs;
}

$searchInput.addEventListener("focus", () => {
  document.querySelector(".itemWrap").classList.add("focus");
});

$searchInput.addEventListener("blur", () => {
  document.querySelector(".itemWrap").classList.remove("focus");
});

//초기 로드시 화면 크기 확인
checkScreenSize();

//화면 크기 변경 시마다 확인
window.addEventListener("resize", checkScreenSize);

//--------
// api
let pageSize = 15; //한 페이지에 보여지는 리스트 수
let page = 1; //현재 페이지
let totalResults = 0; //총 리스트 수
let groupSize = 3; //한번에 보여지는 페이지

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

const movePage = (pageNum) => {
  //2페이지면 16에서 30
  page = pageNum;
  searchParams.pageBegin = (pageNum - 1) * pageSize + 1;
  searchParams.pageEnd = pageNum * pageSize;

  //페이지 이동하면 디테일창 닫아
  removeDetail();

  //리스트 내부 스크롤을 상단으로 이동
  $list.scrollTop = 0;

  panTo(37.5665, 126.978);

  fetchList();
};

// movePage 함수를 window 객체에 추가
window.movePage = movePage;

const pagination = () => {
  let pageGroup = Math.ceil(page / groupSize); // 현재 페이지가 속해있는 그룹
  let firstPage = (pageGroup - 1) * groupSize + 1; //첫번째 페이지
  let lastPage = Math.min(
    Math.ceil(totalResults / pageSize),
    pageGroup * groupSize
  ); //마지막 페이지
  let totalPage = Math.ceil(totalResults / pageSize); //총 페이지
  let prevGroup = (pageGroup - 2) * groupSize + 1; //이전 페이지 그룹의 첫 페이지 계산
  let nextGroup = pageGroup * groupSize + 1; //다음 페이즈 그룹의 첫 페이지 계산

  let paginationHtml = `
      <button class="arrow" ${
        page === 1 ? "disabled" : ""
      } onClick='movePage(${prevGroup})'>
          <img src="./img/left.png" alt="이전 페이지로" />
      </button>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHtml += `<button class="page ${
      i === page ? "on" : ""
    }" onClick='movePage(${i})'>${i}</button>`;
  }

  paginationHtml += `
      <button class="arrow" ${
        page >= totalPage ? "disabled" : ""
      } onClick='movePage(${nextGroup})'>
          <img src="./img/right.png" alt="다음 페이지로" />
      </button>`;

  document.querySelector(".pagination").innerHTML = paginationHtml;
};

const createHtml = (service) => {
  let title =
    service.SVCNM.trim().length > 30
      ? service.SVCNM.trim().substring(0, 31) + "..."
      : service.SVCNM.trim();

  let conditionClass =
    service.SVCSTATNM.trim() === "일시중지"
      ? "red"
      : service.SVCSTATNM.trim() === "예약마감" ||
        service.SVCSTATNM.trim() === "접수종료"
      ? "gray"
      : "";

  return `<div class="serviceItem" data-id="${service.SVCID}">
              <div class="condition ${conditionClass}">${service.SVCSTATNM.trim()}</div>
              <div class="thumnailWrap">
                <img src="${service.IMGURL.trim()}" alt-="" />
              </div>
              <div class="serviceDetailWrap">
                <p class="serviceTitle">
                  ${title}
                </p>
                <div class="detail">
                  <div class="userWrap">
                    <div class="iconWrap">
                      <img src="./img/user.png" alt="" />
                    </div>
                    <div class="age">${service.USETGTINFO.trim()}</div>
                  </div>
                  <div class="locaWrap">
                    <div class="iconWrap">
                      <img src="./img/pin.png" alt="" />
                    </div>
                    <div class="loca">${service.PLACENM.trim()}</div>
                  </div>
                  <div class="dayWrap">
                    <div class="iconWrap">
                      <img src="./img/calendar.png" alt="" />
                    </div>
                    <div class="day">${service.SVCOPNBGNDT.slice(
                      0,
                      10
                    )} ~ ${service.SVCOPNENDDT.slice(0, 10)}</div>
                  </div>
                </div>
              </div>
            </div>`;
};

const renderList = (serviceList) => {
  const serviceHtml = serviceList
    .map((service) => createHtml(service))
    .join("");
  document.getElementById("listCon").innerHTML = serviceHtml;
};

function onClickCategory(e) {
  //클릭한 버튼
  const target = e.target;
  const keyword = target.innerText.split("/")[0];

  //모든 버튼 그룹을 하나의 배열로 합치기
  const allButtons = [...slides, ...menuAllBtns, ...hamberMenuBtns];

  //모든 버튼을 다 돌면서
  allButtons.forEach((btn) => {
    //우선 있는 on 클래스 다 삭제시키고
    btn.classList.remove("on");

    //클릭한 버튼(keyword)과 동일한 텍스트를 가진 버튼에 'on' 클래스 추가
    if (btn.innerText.split("/")[0] === keyword) {
      btn.classList.add("on");
    }
  });

  //전체이면 그냥 빈 문자열 아니면 keyword
  searchParams.minclass = keyword === "전체" ? "" : keyword;

  //페이지 번호를 1로 리셋
  page = 1;
  searchParams.pageBegin = (page - 1) * pageSize + 1;
  searchParams.pageEnd = page * pageSize;

  searchParams.area = selectItem === "지역명" ? "" : selectItem;
  searchParams.svcname = searchValue === "" ? "" : searchValue;

  //리스트 내부 스크롤을 상단으로 이동
  $list.scrollTop = 0;

  panTo(37.5665, 126.978);

  //리스트 불러오기
  fetchList();

  //카테고리 전체보기로 검색할 시 누르고 나서 다시 닫아줘야됨
  $logo.classList.remove("rotate");
  $menuAll.classList.remove("show");

  //카테고리 바뀌면 디테일 창도 닫아줘
  removeDetail();

  console.log(searchParams);
}

//모든 버튼에 이벤트리스너 붙이기
[...slides, ...menuAllBtns, ...hamberMenuBtns].forEach((btn) => {
  btn.addEventListener("click", onClickCategory);
});

//이벤트 위임 => 모든 자식 콘텐츠에 리스너를 박는게 아니라 부모 요소에 붙여준다
$listCon.addEventListener("click", (e) => {
  const screenWidth = window.innerWidth;
  const item = e.target.closest(".serviceItem");
  const serviceId = item.getAttribute("data-id");
  const detail = serviceDetailList[serviceId];
  const link = serviceLinkList[serviceId];
  const serviceX = parseFloat(serviceXList[serviceId]);
  const serviceY = parseFloat(serviceYList[serviceId]);

  if (screenWidth <= 768) {
    //768px이랑 같거나 작으면
    handleMapToggle();
    mobileMap.relayout();

    document.querySelector(".mobileDetailCon").innerHTML =
      extractDetails(detail);
    document.querySelector(".mobileReserBtn").href = link;

    document.querySelector(".mobileDetailCon").scrollTop = 0;

    panTo(serviceY, serviceX);
    mobileMakeMarker(serviceY, serviceX);
  } else {
    //크면
    if (e.target.closest(".serviceItem")) {
      document.querySelector(".detailCon").innerHTML = extractDetails(detail);
      document.querySelector(".reserBtn").href = link;

      panTo(serviceY, serviceX);
      makeMarker(serviceY, serviceX);

      document.querySelector(".detailCon").scrollTop = 0;

      //리스트 클릭하면 디테일창 열어
      addDetail();
    }
  }

  console.log(searchParams);
});

$locaSelect.addEventListener("change", (e) => {
  selectItem = e.target.value;
});

$searchBtn.addEventListener("click", () => {
  try {
    searchValue = $searchInput.value;
    searchParams.area = selectItem === "지역명" ? "" : selectItem;
    searchParams.svcname = searchValue === "" ? "" : searchValue;

    //페이지 번호를 1로 리셋
    page = 1;
    searchParams.pageBegin = (page - 1) * pageSize + 1;
    searchParams.pageEnd = page * pageSize;

    //리스트 내부 스크롤을 상단으로 이동
    $list.scrollTop = 0;

    removeDetail();
    panTo(37.5665, 126.978);
    $searchInput.value = "";
    fetchList();

    console.log(searchParams);
  } catch (e) {
    console.error(e);
  }
});

//초기 로드할 때
fetchList();
