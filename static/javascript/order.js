const checkBtn = document.querySelector(".check-btn");
const bookingName = document.querySelector(".data-name");
const bookingEmail = document.querySelector(".data-email");
const bookingPhone = document.querySelector(".data-phone");
const APP_KEY = "app_qvSPjU6eeXEira64H7q4noAyOE4c1WVNJWsf2iEuDt0PlcatW7C57Oh6Y7Rm";

// 確認姓名格式
function checkNameFormat(name) {
    const NameFormat = /^[\u4e00-\u9fa5]+$/;
    return NameFormat.test(name);
}

// 確認手機格式
function checkPhoneFormat(phone) {
    const PhoneFormat = /^09\d{8}$/;
    return PhoneFormat.test(phone);
}

TPDirect.setupSDK(137130, APP_KEY, "sandbox");
TPDirect.card.setup({
    fields: {
        number: {
            element: "#card-number",
            placeholder: "**** **** **** ****"
        },
        expirationDate: {
            element: "#card-expiration-date",
            placeholder: "MM / YY"
        },
        ccv: {
            element: "#card-ccv",
            placeholder: "CCV"
        }
    },
    styles: {
        "input": {
            "color": "gray"
        },
        "input.ccv": {
            "font-size": "16px"
        },
        "input.expiration-date": {
            "font-size": "16px"
        },
        "input.card-number": {
            "font-size": "16px"
        },
        ":focus": {
            "color": "black"
        },
        ".valid": {
            "color": "green"
        },
        ".invalid": {
            "color": "red"
        },
        "@media screen and (max-width: 400px)": {
            "input": {
                "color": "orange"
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6, 
        endIndex: 11
    }
});

// 前台信用卡資料確認
// update.canGetPrime === true → can call TPDirect.card.getPrime()
TPDirect.card.onUpdate(function (update) {
    if (update.canGetPrime) {
        checkBtn.removeAttribute("disabled");
    } else {
        checkBtn.setAttribute("disabled", true);
    };

    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    };

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    };

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    };
});

// 取得 Prime
checkBtn.addEventListener("click", function(event) {
    event.preventDefault();

    let nameResult = checkNameFormat(bookingName.value);    
    let emailResult = checkEmailFormat(bookingEmail.value);
    let phoneResult = checkPhoneFormat(bookingPhone.value);

    if (bookingName.value === "" || bookingEmail.value === "" || bookingPhone.value === "") {
        alert("聯絡資訊不得為空");      
    } else if (nameResult !== true) {
        alert("請輸入中文姓名");
    } else if (emailResult !== true) {
        alert("請輸入正確Email格式"); 
    } else if (phoneResult !== true) {
        alert("請輸入正確手機格式");
    } else {
        onSubmit(event);
    };
});

function onSubmit(event) {
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert("信用卡資料有誤，請確認後重新輸入");
        return;
    };

    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert("操作失敗，請聯繫客服確認");
            return;
        };
        
        orderRequestData(result.card.prime);
    });
};

// 處理 Request Body 資料
function orderRequestData(prime) {
    let data = {
        "prime": prime,
        "order": {
            "price": orderData.price,
            "trip": {
                "attraction": {
                    "id": orderData.attraction.id,
                    "name": orderData.attraction.name,
                    "address": orderData.attraction.address,
                    "image": orderData.attraction.image
            },
            "date": orderData.date,
            "time": orderData.time
            },
            "contact": {
                "name": bookingName.value,
                "email": bookingEmail.value,
                "phone": bookingPhone.value
            }
        }
    };

    createOrders(data);
};

// 呼叫 POST API
async function createOrders(data) {
    try {
        let response = await fetch("/api/orders", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
        });

        let orderStatus = await response.json();
        location.href = `http://${hostname}/thankyou?number=${orderStatus.data.number}`;
    } catch (error) {
        console.log("Error:", error);
    };
};