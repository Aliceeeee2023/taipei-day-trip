// 取得 AttractionId
const path = location.pathname;
const splitPath = path.split("/");
const attractionId = splitPath[2];

// 按鈕變化相關變數
const dayBtn = document.querySelector(".booking_time_daybtn");
const nightBtn = document.querySelector(".booking_time_nightbtn");
let dayMode = true;
let nightMode = false;

// 輪播圖相關變數
const picContainer = document.querySelector(".pic-container");
const picLeftArrow = document.querySelector(".pic-left_arrow");
const picRightArrow = document.querySelector(".pic-right_arrow");
const picChild = picContainer.children;
const picPosition = [];
let currentSlideIndex = 0;
let newSlideIndex = 0;

// 預定行程相關變數
const bookingBtn = document.querySelector(".booking_btn");
const bookingDate = document.querySelector(".booking_date_choose");
const bookingCost = document.querySelector(".booking_cost_info");
const bookingError = document.querySelector(".booking_error");
let bookingCostValue = "";
let bookingTimeValue = "";

// 資料生成函式
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
            bookingDataToday();
        }
    } catch (error) {
        console.log("Error:", error);
    }
};
getAttractionData();

// 處理預定行程日期
function bookingDataToday() {
    let today = new Date();
    let todayDay = String(today.getDate()).padStart(2, "0");
    let todayMonth = String(today.getMonth() + 1).padStart(2, "0");
    let todayYear = today.getFullYear();
    today = todayYear + "-" + todayMonth + "-" + todayDay;
    
    bookingDate.value = today;
    bookingDate.min = today;
};

// 設置按鈕變化
dayBtn.addEventListener("click", () => {
    if ( !dayMode ) {
        dayBtn.querySelector("img").src = "../static/images/green-btn.png";
        nightBtn.querySelector("img").src = "../static/images/white-btn.png";

        let bookingCost = document.querySelector(".booking_cost_info");
        bookingCost.textContent = "新台幣 2000 元";

        dayMode = true;
        nightMode = false;
    } 
});
nightBtn.addEventListener("click", () => {
    if ( !nightMode ) {
        dayBtn.querySelector("img").src = "../static/images/white-btn.png";
        nightBtn.querySelector("img").src = "../static/images/green-btn.png";

        let bookingCost = document.querySelector(".booking_cost_info");
        bookingCost.textContent = "新台幣 2500 元";

        nightMode = true;
        dayMode = false;
    } 
});

// 輪播圖處理
function createSlide() {
    for (i = 0; i < picChild.length; i++) {
        picPosition[i] = i * 100;
        picChild[i].style.left = `${picPosition[i]}%`;
    }
}
function showSlide(newIndex, nowIndex) {
    // console.log("現在的點：", nowIndex, "新的點：",newIndex);

    for (i = 0; i < picChild.length; i++) {
        const newPosition = -newIndex * 100;
        const originPosition = i * 100;
        picChild[i].style.left = `${parseInt(originPosition) + newPosition}%`;
    }
    dotSlide(newIndex, nowIndex);
}

// 輪播圖箭頭處理
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

// 判斷行程時間
function checkBookingTime() {
    let bookingTime = document.querySelector(".booking_time_daybtn");
    let bookingTimeBtn = bookingTime.querySelector("img");
    let bookingTimeSrc = bookingTimeBtn.getAttribute("src");

    if (bookingTimeSrc.includes("green")) {
        bookingTimeValue = "上半天";
    } else {
        bookingTimeValue = "下半天";       
    }
};

// 處理行程金額
function checkBookingCost(bookingCost) {
    let bookingCostString = bookingCost.textContent;

    bookingCostMath = bookingCostString.match(/\d+/);
    bookingCostValue = bookingCostMath[0];
};

// 新增預定行程按鈕判斷
bookingBtn.addEventListener("click", () => {
    checkBookingTime();
    checkBookingCost(bookingCost);

    let bookingData = {
        "attractionId": attractionId,
        "date": bookingDate.value,
        "time": bookingTimeValue,
        "price": bookingCostValue
    };
    postBooking(bookingData);
})

async function postBooking(bookingdata) {
    try {
        let response = await fetch("/api/booking", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bookingdata),
        });
        let data = await response.json();

        if (data.error && data.message === "未登入系統，拒絕存取") {
            loginForm.style.display = "block";
            signupBackground.style.display = "block";
        } else if (data.ok) {
            window.location.href = `http://${hostname}/booking`;
        };
    } catch (error) {
        console.log("Error:", error);
    };
};