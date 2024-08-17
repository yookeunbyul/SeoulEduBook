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

//초기 로드시 화면 크기 확인
checkScreenSize();

//화면 크기 변경 시마다 확인
window.addEventListener("resize", checkScreenSize);

//--------
// api
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

  console.log(page);

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
  return `<div class="serviceItem">
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

//초기 로드할 때
fetchList();
