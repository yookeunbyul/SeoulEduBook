import config from "./config.js";
const { API_KEY } = config;

let pageSize = 15; //한 페이지에 보여지는 리스트 수
let page = 1; //현재 페이지
let totalResults = 0; //총 리스트 수
let groupSize = 3; //한번에 보여지는 페이지

// ui

const $logo = document.getElementById("logo");
const $menuAll = document.querySelector(".menuAll");

function handleLogoClick(e) {
  e.preventDefault();
  $logo.classList.toggle("rotate");
  $menuAll.classList.toggle("show");
}

function checkScreenSize() {
  const screenWidth = window.innerWidth;

  if (screenWidth <= 768) {
    //768보다 같거나 작으면
    $logo.removeEventListener("click", handleLogoClick);
  } else {
    //크면
    $logo.addEventListener("click", handleLogoClick);
  }
}

//초기 로드시 화면 크기 확인
checkScreenSize();

//화면 크기 변경 시마다 확인
window.addEventListener("resize", checkScreenSize);

// api

const fetchList = async () => {
  let serviceList = [];
  const res = await fetch(
    `http://openAPI.seoul.go.kr:8088/${API_KEY}/json/ListPublicReservationEducation/1/15/`
  );
  const data = await res.json();

  totalResults = data.ListPublicReservationEducation.list_total_count;
  serviceList = data.ListPublicReservationEducation.row;

  console.log(data.ListPublicReservationEducation.row);

  renderList(serviceList);
};

const createHtml = (service) => {
  return `<div class="serviceItem">
              <div class="thumnailWrap">
                <img src="${service.IMGURL}" alt-="" />
              </div>
              <div class="serviceDetailWrap">
                <p class="serviceTitle">
                  ${service.SVCNM.trim()}
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
