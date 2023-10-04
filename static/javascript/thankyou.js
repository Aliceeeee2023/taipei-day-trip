let queryString = window.location.search;
let orderNumber = queryString.split("=")[1];

// 將訂單編號塞進 HTML
function getorderNumber(order) {
    let orderNumberDiv = document.querySelector(".order-number");
    orderNumberDiv.textContent = `訂單編號：${orderNumber}`;
};
getorderNumber(orderNumber);