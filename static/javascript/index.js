const hostname = window.location.host;

function createAttractions(result) {
    let main = document.querySelector(".main");
    let footer = document.querySelector(".footer");
    document.body.insertBefore(main, footer);

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

        mainNameContainer.appendChild(mainName);        
        mainPic.appendChild(mainNameContainer);
        mainInfo.appendChild(mainMrt);
        mainInfo.appendChild(mainCategory);
        mainContent.appendChild(mainPic);
        mainContent.appendChild(mainInfo);
        mainContainer.appendChild(mainContent);
    }
}


let normalPage = 0;

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


let mode = "Normal";

const searchButton = document.querySelector(".banner-search_btn");            
searchButton.addEventListener("click", () => {
    mode = "Search";

    searchWord = document.querySelector(".banner-search_bar").value;  
    let mainContainer = document.querySelector('.main-container');
    mainContainer.innerHTML = "";

    getSearchData();
});


let searchPage = 0;
let searchWord = "";

async function getSearchData(searchUrl) {
    try {
        searchUrl = `http://${hostname}/api/attractions?keyword=${searchWord}&page=${searchPage}`
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
                searchWord = mrt_name.textContent;

                searchUrl = `http://${hostname}/api/attractions?keyword=${searchWord}`;
                getSearchData(searchUrl);
            });  
        }
    } catch (error) {
        console.log("Error:", error);
    };
};
getMrtList();


function observeLoading() {
    let options = { threshold:[0.9] };
    let callback = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting && mode == "Normal") {
                getNormalData();
            } else if (entry.isIntersecting && mode == "SearchNext") {
                getSearchData();         
            };
        });
    };

    const observer = new IntersectionObserver(callback, options);
    const target = document.querySelector(".footer");
    observer.observe(target);
}
window.addEventListener("load", observeLoading);


const mrtContent = document.querySelector(".mrt-content");
const mrtLeftBtn = document.querySelector(".mrt-leftbtn");
const mrtRightBtn = document.querySelector(".mrt-rightbtn");

mrtLeftBtn.addEventListener("click", () => {
    mrtContent.scrollBy(-1100, 0);
});

mrtRightBtn.addEventListener("click", () => {
    mrtContent.scrollBy(+1100, 0);
});