// 登入、登出相關變數
const navLogin = document.querySelector(".header-nav_login");
const navLogout = document.querySelector(".header-nav_logout");
const signupForm = document.querySelector(".signup");
const loginForm = document.querySelector(".login");
const signupClose = document.querySelector(".signup-close");
const loginClose = document.querySelector(".login-close");
const signupBackground = document.querySelector(".black-background");
const changeIoLogin = document.querySelector(".change-to-login");
const changeToSignup = document.querySelector(".change-to-signup");
const signupName = document.querySelector(".signup-name");
const signupEmail = document.querySelector(".signup-email");
const signupPassword = document.querySelector(".signup-password");
const signupBtn = document.querySelector(".signup-btn");
const signupStatus = document.querySelector(".signup-status");
const loginEmail = document.querySelector(".login-email");
const loginPassword = document.querySelector(".login-password");
const loginBtn = document.querySelector(".login-btn");
const loginStatus = document.querySelector(".login-status");
const getBooking = document.querySelector(".header-nav_content");
const token = localStorage.getItem("token");

// 首頁相關變數
const hostname = window.location.host;
const headerTitle = document.querySelector(".header-title");

// 首頁選項跳轉
headerTitle.addEventListener("click", function () {
    window.location.href = `http://${hostname}/`;
});

// 確認是否有登入
async function checkUsers(token) {
    try {
        let response = await fetch("/api/user/auth", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        let data = await response.json();
        let status = data.data;

        if (status !== null) {
            navLogin.style.display = "none";
            navLogout.style.display = "block";
            return status;
        };
    } catch (error) {
        console.log("Error:", error);
    };
};
checkUsers(token);

// 清空資料函式
function resetSignupData() {
    signupName.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
}
function resetLoginData() {
    loginEmail.value = "";
    loginPassword.value = "";
};

// 確認郵件格式
function checkEmailFormat(email) {
    const EmailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return EmailFormat.test(email);
}

// 關閉彈出式表單+清除錯誤訊息
function closeForm() {
    loginForm.style.display = "none";
    signupForm.style.display = "none";
    signupBackground.style.display = "none";

    signupStatus.style.display = "none";
    loginStatus.style.display = "none";

    resetSignupData();
    resetLoginData();
}
signupClose.addEventListener("click", closeForm);
loginClose.addEventListener("click", closeForm);
signupBackground.addEventListener("click", closeForm);

// 登入登出處理
navLogin.addEventListener("click", () => {
    loginForm.style.display = "block";
    signupBackground.style.display = "block";
});
navLogout.addEventListener("click", () => {
    localStorage.removeItem("token");

    navLogout.style.display = "none";
    navLogin.style.display = "block";
    window.location.reload();
})

// 登入／註冊選單更換
changeIoLogin.addEventListener("click", () => {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    signupStatus.style.display = "none";
    resetSignupData();
});
changeToSignup.addEventListener("click", () => {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    loginStatus.style.display = "none";
    resetLoginData();
});

// 會員註冊
signupBtn.addEventListener("click", () => {
    const signupData = {
        "name" : signupName.value,
        "email" : signupEmail.value,
        "password" : signupPassword.value
    };
    let emailResult = checkEmailFormat(signupEmail.value);

    if (signupName.value !== "" && emailResult === true && signupPassword.value !== "") {
        signup(signupData);
    } else if (signupName.value !== "" && signupEmail.value !== "" && signupPassword.value !== "") {
        signupStatus.style.display = "block";
        signupStatus.textContent = "Email格式不正確";
        resetSignupData();
    } else {
        signupStatus.style.display = "block";
        signupStatus.textContent = "註冊資料不得為空";
        resetSignupData();
    };
});

async function signup(data) {
    try {
        let response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        resetSignupData();

        let result = await response.json();
        if (response.status === 200) {
            signupStatus.style.display = "block";
            signupStatus.textContent = "已註冊成功";          
        } else {
            let message = result.message;
            signupStatus.style.display = "block";
            signupStatus.textContent = message;
        };
    } catch (error) {
        console.log("Error:", error);
    };
};

// 會員登入
loginBtn.addEventListener("click", () => {
    const loginData = {
        "email" : loginEmail.value,
        "password" : loginPassword.value
    };
    let emailResult = checkEmailFormat(loginEmail.value);

    if (emailResult === true && loginPassword.value !== "") {
        login(loginData);
    } else if (loginEmail.value !== "" && loginPassword.value !== "") {
        loginStatus.style.display = "block";
        loginStatus.textContent = "Email格式不正確";
        resetLoginData();
    } else {
        loginStatus.style.display = "block";
        loginStatus.textContent = "登入資料不得為空";
        resetLoginData();
    };
});

async function login(data) {
    try {
        let response = await fetch("/api/user/auth", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        resetLoginData();

        let result = await response.json();
        if (response.status === 200) {
            localStorage.setItem("token", result.token);

            navLogin.style.display = "none";
            navLogout.style.display = "block";
            window.location.reload();
        } else {
            let message = result.message;
            loginStatus.style.display = "block";
            loginStatus.textContent = message; 
        };
    } catch (error) {
        console.log("Error:", error);
    };
};

// 預定行程判斷
getBooking.addEventListener("click", function () {
    checkBooking(token);
});

async function checkBooking(token) {
    try {
        let response = await fetch("/api/user/auth", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });
        let data = await response.json();
        let status = data.data;

        if (status !== null) {
            window.location.href = `http://${hostname}/booking`;
        } else {
            loginForm.style.display = "block";
            signupBackground.style.display = "block";
        };
    } catch (error) {
        console.log("Error:", error);
    };
};