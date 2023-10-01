const body = document.querySelector(".body");
const booking = document.querySelector(".booking");
const bookingNocontent = document.querySelector(".booking-nocontent");
const bookingData = document.querySelector(".booking-data");
const bookingDelete = document.querySelector(".location-delete");
const footer = document.querySelector(".footer");

// 新增預定頁面資料
async function checkUsers(token) {
    try {
        let response = await fetch("/api/booking", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        let data = await response.json();
        let status = data.data;

        if ("error" in data) {           
            body.style.display = "none";
            window.location.href = `http://${hostname}/`;
        } else if (status !== null && "attraction" in status) {   
            getMember();
            createBooking(status);
            body.style.display = "block";
            bookingData.style.display = "block";
            bookingNocontent.style.display = "none";
            footer.style.height = "104px";
        } else {
            getMember();
            bookingData.style.display = "none";
            bookingNocontent.style.display = "block";
        }
    } catch (error) {
        console.log("Error:", error);
    };
};
checkUsers(token);

function createBooking(data) {
    let locationPic = document.querySelector(".location-pic_img");
    locationPic.src = data.attraction.image;
    
    let locationName = document.querySelector(".location-name");
    locationName.textContent = data.attraction.name; 

    let dateContent = document.querySelector(".date-content");
    dateContent.textContent = data.date; 
   
    let timeContent = document.querySelector(".time-content");
    timeContent.textContent = data.time; 
    
    let costContent = document.querySelector(".cost-content");
    costContent.textContent = `${data.price}元`; 

    let addressContent = document.querySelector(".address-content");
    addressContent.textContent = data.attraction.address; 

    let checkCost = document.querySelector(".check-cost");
    checkCost.textContent = `總價：新台幣 ${data.price} 元`; 
};

async function getMember() {
    try {
        let response = await fetch("/api/user/auth", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        let data = await response.json();
        let status = data.data;

        let bookingTitle = document.querySelector(".booking-title");
        bookingTitle.textContent = `您好，${status.name}，待預定的行程如下：`;         

        let dataName = document.querySelector(".data-name");
        dataName.value = status.name; 

        let dataEmail = document.querySelector(".data-email");
        dataEmail.value = status.email; 
    } catch (error) {
        console.log("Error:", error);
    };
}

// 刪除預定頁面資料
bookingDelete.addEventListener("click", () => {
    deleteBooking();
})

async function deleteBooking() {
    try {
        let response = await fetch("/api/booking", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        let data = await response.json();

        if ("ok" in data) {
            window.location.reload();
        };
    } catch (error) {
        console.log("Error:", error);
    };
}