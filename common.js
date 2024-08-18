import config from "./config.js";
const { API_KEY } = config;

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

//--------
//swiper
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 8,
  spaceBetween: 15,
});

//--------
//kakao map
document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("map");
  var options = {
    center: new kakao.maps.LatLng(37.5665, 126.978),
    level: 3,
  };

  var map = new kakao.maps.Map(container, options);
});

//--------
// ui
const $logo = document.getElementById("logo");
const $menuAll = document.querySelector(".menuAll");
//[모바일] 햄버거 메뉴(카테고리 영역)
const $hamberMenu = document.querySelector(".hamber-menu");
//[모바일] 햄버거 메뉴 버튼
const $menuBtn = document.querySelector(".menuBtn");
//[모바일] 닫기 버튼
const $closeImgBtn = document.querySelector(".close-img-btn");

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

function checkScreenSize() {
  const screenWidth = window.innerWidth;

  //이벤트 리스너 중복 제거
  $logo.removeEventListener("click", handleLogoClick);
  $menuBtn.removeEventListener("click", handleMenuToggle);
  $closeImgBtn.removeEventListener("click", handleMenuToggle);

  if (screenWidth <= 768) {
    //768보다 같거나 작으면
    //연 상태로 작아지면 다 제거
    $logo.classList.remove("rotate");
    $menuAll.classList.remove("show");
    $hamberMenu.classList.remove("show");

    $menuBtn.addEventListener("click", handleMenuToggle);
    $closeImgBtn.addEventListener("click", handleMenuToggle);
  } else {
    //크면
    $logo.addEventListener("click", handleLogoClick);
    //연 상태로 커지면 제거
    $hamberMenu.classList.remove("show");
  }
}

function addDetail() {
  document.querySelector(".detailCon").classList.add("show");
  document.querySelector(".reserCon").classList.add("show");
}

function removeDetail() {
  document.querySelector(".detailCon").classList.remove("show");
  document.querySelector(".reserCon").classList.remove("show");
}

//초기 로드시 화면 크기 확인
checkScreenSize();

//화면 크기 변경 시마다 확인
window.addEventListener("resize", checkScreenSize);

//--------
// api
let serviceDetailList = {};
let serviceLinkList = {};

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
    });
    serviceList.forEach((service) => {
      serviceLinkList[service.SVCID] = service.SVCURL;
    });

    renderList(serviceList);
    pagination();
  } catch (e) {
    console.error(e);
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
                <img src="${service.IMGURL}" alt-="" />
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

const slides = document.querySelectorAll(".swiper-slide");
const menuAllBtns = document.querySelectorAll(".menuAll-btn");
const hamberMenuBtns = document.querySelectorAll(".hamber-menu-btn");
const $list = document.querySelector(".list");

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

  //리스트 내부 스크롤을 상단으로 이동
  $list.scrollTop = 0;

  //리스트 불러오기
  fetchList();

  //카테고리 전체보기로 검색할 시 누르고 나서 다시 닫아줘야됨
  $logo.classList.remove("rotate");
  $menuAll.classList.remove("show");

  //카테고리 바뀌면 디테일 창도 닫아줘
  removeDetail();
}

//모든 버튼에 이벤트리스너 붙이기
[...slides, ...menuAllBtns, ...hamberMenuBtns].forEach((btn) => {
  btn.addEventListener("click", onClickCategory);
});

const $listCon = document.getElementById("listCon");

//이벤트 위임 => 모든 자식 콘텐츠에 리스너를 박는게 아니라 부모 요소에 붙여준다
$listCon.addEventListener("click", (e) => {
  if (e.target.closest(".serviceItem")) {
    const item = e.target.closest(".serviceItem");
    const serviceId = item.getAttribute("data-id");
    const detail = serviceDetailList[serviceId];
    const link = serviceLinkList[serviceId];

    document.querySelector(".detailCon").innerHTML = detail;
    document.querySelector(".reserBtn").href = link;

    //리스트 클릭하면 디테일창 열어
    addDetail();
  }
});

//초기 로드할 때
fetchList();
