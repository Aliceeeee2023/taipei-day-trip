// MRT 及搜尋框相關變數
const mrtContent = document.querySelector(".mrt-content");
const mrtLeftBtn = document.querySelector(".mrt-leftbtn");
const mrtRightBtn = document.querySelector(".mrt-rightbtn");
const searchButton = document.querySelector(".banner-search_btn");   

// 自動生成相關變數
let mode = "Normal";
let normalPage = 0;
let searchPage = 0;
let searchWord = "";

// 建立 main 物件
function createAttractions(result) {
    let mainContainer = document.querySelector(".main-container");         

    for (let i=0; i<result.length; i++) {
        let mainContent = document.createElement("div");
        mainContent.className = "main-content";

        let mainPic = document.createElement("div");
        mainPic.className = "main-pic";  
        mainPic.style.backgroundImage = `url("${result[i].images[0]}")`; 
        
        let mainNameContainer = document.createElement("div");
        mainNameContainer.className = "main-name_container";          

        let mainName = document.createElement("div");
        mainName.className = "main-name";
        mainName.textContent = result[i].name;

        let mainInfo = document.createElement("div");
        mainInfo.className = "main-info";  

        let mainMrt = document.createElement("div");
        mainMrt.className = "main-mrt";  
        mainMrt.textContent = result[i].mrt;      

        let mainCategory = document.createElement("div");
        mainCategory.className = "main-category";  
        mainCategory.textContent = result[i].category;

        mainContent.addEventListener("click", function () {
            window.location.href = `http://${hostname}/attraction/` + result[i].id;
        });

        mainNameContainer.appendChild(mainName);        
        mainPic.appendChild(mainNameContainer);
        mainInfo.appendChild(mainMrt);
        mainInfo.appendChild(mainCategory);
        mainContent.appendChild(mainPic);
        mainContent.appendChild(mainInfo);
        mainContainer.appendChild(mainContent);
    }
}

async function getNormalData() {
    try {
        searchUrl = `http://${hostname}/api/attractions?page=${normalPage}`
        let response = await fetch(searchUrl);
        let data = await response.json();

        let result = data.data;
        let nextPage = data.nextPage;

        createAttractions(result);
        if (nextPage) {
            normalPage++;
        } else {
            normalPage = 0;
            mode = "NormalStop";
        }
    } catch (error) {
        console.log("Error:", error);
    }
}
getNormalData();

// 搜尋框事件         
searchButton.addEventListener("click", () => {
    mode = "Search";

    if (searchWord !== document.querySelector(".banner-search_bar").value) {
        searchPage = 0;
    }

    searchWord = document.querySelector(".banner-search_bar").value;  
    let mainContainer = document.querySelector('.main-container');
    mainContainer.innerHTML = "";

    searchUrl = `http://${hostname}/api/attractions?keyword=${searchWord}&page=${searchPage}`
    getSearchData(searchUrl);
});

async function getSearchData(searchUrl) {
    try {
        let response = await fetch(searchUrl);
        let data = await response.json();

        let result = data.data;
        let nextPage = data.nextPage;

        createAttractions(result);

        if (result.length === 0) {
            let mainContainer = document.querySelector(".main-container");    

            let mainError = document.createElement("div");
            mainError.className = "main-error";  
            mainError.textContent = "未查詢到任何景點，請重新輸入"
    
            mainContainer.appendChild(mainError);
        } else if (nextPage) {
            searchPage++;
            mode = "SearchNext";
        } else {
            searchPage = 0;
            mode = "Search";
        }
    } catch (error) {
        console.log("Error:", error);
    };
};

// 生成 MRT 列表
async function getMrtList() {
    try {
        searchUrl = `http://${hostname}/api/mrts`
        let response = await fetch(searchUrl);
        let data = await response.json();

        let result = data.data;
        let mrt_list_container = document.querySelector(".mrt-content");
        
        for (let i=0; i<result.length; i++) {
            let mrt_name = document.createElement("div");
            mrt_name.className = "mrt-content_name";

            mrt_name.textContent = result[i];      
            mrt_list_container.appendChild(mrt_name);

            mrt_name.addEventListener("click", () => {
                mode = "Search";

                let mainContainer = document.querySelector(".main-container");
                mainContainer.innerHTML = "";

                // 比較前後的關鍵字，相同則不更動頁數，不同則將頁數歸0
                // 避免有未捲到最下方的情況，導致未更新到 searchPage
                if (searchWord !== mrt_name.textContent) {
                    searchPage = 0;
                };

                searchWord = mrt_name.textContent;

                let searchBar = document.querySelector(".banner-search_bar");
                searchBar.value = mrt_name.textContent;
                searchBar.style.color = "#000";

                searchUrl = `http://${hostname}/api/attractions?keyword=${searchWord}&page=${searchPage}`;
                getSearchData(searchUrl);
            });  
        }
    } catch (error) {
        console.log("Error:", error);
    };
};
getMrtList();

// MRT 列表控制
mrtLeftBtn.addEventListener("click", () => {
    mrtContent.scrollBy(-500, 0);
});

mrtRightBtn.addEventListener("click", () => {
    mrtContent.scrollBy(+500, 0);
});

// 自動載入事件
function observeLoading() {
    let options = { threshold:[0.9] };
    let callback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && mode == "Normal") {
                getNormalData();
            } else if (entry.isIntersecting && mode == "SearchNext") {
                searchUrl = `http://${hostname}/api/attractions?keyword=${searchWord}&page=${searchPage}`
                getSearchData(searchUrl);         
            };
        });
    };

    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector(".footer");
    observer.observe(target);
}
window.addEventListener("load", observeLoading);