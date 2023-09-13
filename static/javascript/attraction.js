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
let currentSlideIndex = 0;

function createSlide() {
    for (i = 0; i < picChild.length; i++) {
        picPosition[i] = i * 100;
        picChild[i].style.left = `${picPosition[i]}%`;
    }
}

function showSlide(index, dotindex) {
    currentSlideIndex = index;
    for (i = 0; i < picChild.length; i++) {
        const newPosition = -index * 100;
        const originPosition = i * 100;     
        picChild[i].style.left = `${parseInt(originPosition) + newPosition}%`;
    }
    dotSlide(dotindex);
}

let dotSlideIndex = 0;

// 輪播圖左右箭頭
const picLeftArrow = document.querySelector(".pic-left_arrow");
const picRightArrow = document.querySelector(".pic-right_arrow");

picLeftArrow.addEventListener("click", function () {
    currentSlideIndex = (currentSlideIndex - 1 + picChild.length) % picChild.length;
    dotSlideIndex = (dotSlideIndex - 1) % 3;
    showSlide(currentSlideIndex, dotSlideIndex);
});
picRightArrow.addEventListener("click", function () {
    currentSlideIndex = (currentSlideIndex + 1) % picChild.length;
    dotSlideIndex = (dotSlideIndex + 1) % 3;
    showSlide(currentSlideIndex, dotSlideIndex);
});

// 輪播圖下方圓點
const picDot1 = document.querySelector(".pic-dot_pic1");
const picDot2 = document.querySelector(".pic-dot_pic2");
const picDot3 = document.querySelector(".pic-dot_pic3");

function dotSlide(index) {
    dotSlideIndex = index;

    if (index == 0) {
        picDot1.querySelector("img").src = "../static/images/black-circle.png";
        picDot2.querySelector("img").src = "../static/images/white-circle.png";        
        picDot3.querySelector("img").src = "../static/images/white-circle.png";
    } else if (index == 1) {
        picDot1.querySelector("img").src = "../static/images/white-circle.png";
        picDot2.querySelector("img").src = "../static/images/black-circle.png";        
        picDot3.querySelector("img").src = "../static/images/white-circle.png";
    } else {
        picDot1.querySelector("img").src = "../static/images/white-circle.png";
        picDot2.querySelector("img").src = "../static/images/white-circle.png";        
        picDot3.querySelector("img").src = "../static/images/black-circle.png";
    }
}

function createDotListener() {
    picDot1.addEventListener("click", function () {
        nowdotIndex = 0;
        distance = dotSlideIndex - nowdotIndex;

        currentSlideIndex = (currentSlideIndex - distance + picChild.length) % picChild.length;
        dotSlideIndex = (dotSlideIndex - distance) % 3;        

        showSlide(currentSlideIndex, dotSlideIndex);
    });
    picDot2.addEventListener("click", function () {
        nowdotIndex = 1;
        distance = dotSlideIndex - nowdotIndex;

        currentSlideIndex = (currentSlideIndex - distance + picChild.length) % picChild.length;
        dotSlideIndex = (dotSlideIndex - distance) % 3;        

        showSlide(currentSlideIndex, dotSlideIndex);
    });
    picDot3.addEventListener("click", function () {
        nowdotIndex = 2;
        distance = dotSlideIndex - nowdotIndex;

        currentSlideIndex = (currentSlideIndex - distance + picChild.length) % picChild.length;
        dotSlideIndex = (dotSlideIndex - distance) % 3;        

        showSlide(currentSlideIndex, dotSlideIndex);
    });
}
createDotListener();