const hostname = window.location.host;

// 取得 AttractionId
let path = location.pathname;
let splitPath = path.split("/");
let attractionId = splitPath[2];

// 將資料放入網頁中
function addAttraction(result) {

    let attractionPic = document.querySelector(".attraction-pic");
    attractionPic.style.backgroundImage = `url("${result.images[0]}")`; 

    let picContainer = document.querySelector(".pic-container");

    for (i = 0; i < result.images.length; i++) {
        let picSlide = document.createElement("div");
        picSlide.className = "pic-slide";

        let imgElement = document.createElement("img");
        imgElement.src = result.images[i];

        picSlide.appendChild(imgElement);
        picContainer.appendChild(picSlide);

        // 創建多個 Dot
        let picDot = document.querySelector(".pic-dot");

        let picDotPic = document.createElement("div");
        picDotPic.className = "pic-dot_pic";
        picDotPic.id = `pic-dot_pic${i}`

        let picImgElement = document.createElement("img");

        if (i === 0) {
            picImgElement.src = "../static/images/black-circle.png";
        } else {
            picImgElement.src = "../static/images/white-circle.png";            
        }

        picDotPic.appendChild(picImgElement);
        picDot.appendChild(picDotPic);

        picDotPic.addEventListener('click', function(index) {
            return function() {
                showSlide(index, currentSlideIndex);
            }
        }(i));
    }

    let attractionTitle = document.querySelector(".attraction-title");
    attractionTitle.textContent = result.name;

    let attractionIntro = document.querySelector(".attraction-intro");
    attractionIntro.textContent = result.category + " at " + result.mrt;  

    let inforsData = document.querySelector(".infors-data");
    inforsData.textContent = result.description;  

    let inforsAddress = document.querySelector(".infors-address");
    inforsAddress.textContent = result.address;  

    let inforsTransport = document.querySelector(".infors-transport");
    inforsTransport.textContent = result.transport;  
}

async function getAttractionData() {
    try {
        if (attractionId > 58) {
            window.location.href = `http://${hostname}/`
        } else {
            searchUrl = `http://${hostname}/api/attraction/${attractionId}`
            let response = await fetch(searchUrl);

            let data = await response.json();
            let result = data.data;
    
            addAttraction(result);
            createSlide(); 
        }
    } catch (error) {
        console.log("Error:", error);
    }
}
getAttractionData();

// 設置按鈕變化
let dayBtn = document.querySelector(".booking_time_daybtn");
let nightBtn = document.querySelector(".booking_time_nightbtn");

let dayMode = true;
let nightMode = false;

dayBtn.addEventListener("click", () => {
    if ( !dayMode ) {
        dayBtn.querySelector("img").src = "../static/images/green-btn.png";
        nightBtn.querySelector("img").src = "../static/images/white-btn.png";

        let bookingCost = document.querySelector(".booking_cost_info");
        bookingCost.textContent = "新台幣 2000元";

        dayMode = true;
        nightMode = false;
    } 
});

nightBtn.addEventListener("click", () => {
    if ( !nightMode ) {
        dayBtn.querySelector("img").src = "../static/images/white-btn.png";
        nightBtn.querySelector("img").src = "../static/images/green-btn.png";

        let bookingCost = document.querySelector(".booking_cost_info");
        bookingCost.textContent = "新台幣 2500元";

        nightMode = true;
        dayMode = false;
    } 
});

// 設置首頁跳轉
const headerTitle = document.querySelector(".header-title");

headerTitle.addEventListener("click", function () {
    window.location.href = `http://${hostname}/`;
});

// 輪播圖
const picContainer = document.querySelector(".pic-container");
const picChild = picContainer.children;

const picPosition = [];
function createSlide() {
    for (i = 0; i < picChild.length; i++) {
        picPosition[i] = i * 100;
        picChild[i].style.left = `${picPosition[i]}%`;
    }
}

let currentSlideIndex = 0;
let newSlideIndex = 0;

function showSlide(newIndex, nowIndex) {
    console.log("現在的點：", nowIndex, "新的點：",newIndex);

    for (i = 0; i < picChild.length; i++) {
        const newPosition = -newIndex * 100;
        const originPosition = i * 100;
        picChild[i].style.left = `${parseInt(originPosition) + newPosition}%`;
    }
    dotSlide(newIndex, nowIndex);
}

// 輪播圖左右箭頭
const picLeftArrow = document.querySelector(".pic-left_arrow");
const picRightArrow = document.querySelector(".pic-right_arrow");

picLeftArrow.addEventListener("click", function () {
    newSlideIndex = (currentSlideIndex - 1 + picChild.length) % picChild.length;

    showSlide(newSlideIndex, currentSlideIndex);
});
picRightArrow.addEventListener("click", function () {
    newSlideIndex = (currentSlideIndex + 1) % picChild.length;

    showSlide(newSlideIndex, currentSlideIndex);
});

// 點擊左右按鈕後同時進行點的變換
function dotSlide(newDot, nowDot) {
    if (newDot !== nowDot) { // 如果選擇的點跟現在的點相同則不進行任何動作
        let targetElement = document.getElementById(`pic-dot_pic${newDot}`);
        targetElement.querySelector("img").src = "../static/images/black-circle.png";
    
        let originElement = document.getElementById(`pic-dot_pic${nowDot}`);
        originElement.querySelector("img").src = "../static/images/white-circle.png";
    
        currentSlideIndex = newDot;
    }
}