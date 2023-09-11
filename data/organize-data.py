import os, json

def check_path():
    path = os.getcwd()
    print(path)

with open("taipei-attractions.json", mode="r", encoding="utf-8") as file:
    data = json.load(file)
detail = data["result"]["results"]
# print(detail)

def check_data():
    for i in detail:
        check_infor = i["_id"]
        print(check_infor)

def organize_data():
    new_data = []
    i = 1

    for item in detail:
        new_item = {
            "id" : i,
            "name" : item["name"],
            "category" : item["CAT"],
            "description" : item["description"],
            "address" : item["address"],
            "transport" : item["direction"],        
            "mrt" : item["MRT"],
            "lat" : item["latitude"],
            "lng" : item["longitude"],        
            "images" : item["file"]
        }
        new_data.append(new_item)
        i = i + 1

    with open("attractions.json", mode="w", encoding="utf-8") as newfile:
        json.dump(new_data, newfile)

def organize_url():
    with open("attractions.json", mode="r", encoding="utf-8") as newfile:
        new_data = json.load(newfile)
    
    url_data = []

    for item in new_data:
        images = item["images"].lower().split("https://") # 全部轉換成小寫方便比對
        new_images = ["https://" + url for url in images if url.endswith(".jpg") or url.endswith(".png")] # 使用 List Comprehension，等於 for 創建新 list 的概念

        url = {
            "id" : item["id"],
            "images" : new_images
        }
        url_data.append(url)

    with open("url.json", mode="w", encoding="utf-8") as newfile1:
            json.dump(url_data, newfile1)

def final_url():
    with open("attractions.json", mode="r", encoding="utf-8") as newfile:
        new_data = json.load(newfile)
    
    url_data = []

    for item in new_data:
        images = item["images"].lower().split("https://")
        new_images = ["https://" + url for url in images if url.endswith(".jpg") or url.endswith(".png")]

        for final in new_images: # 把圖片陸續抓出來搭配 id 後建立新的 list
            url = {
                "id" : item["id"],
                "images" : final
            }
            url_data.append(url)

    with open("final-url.json", mode="w", encoding="utf-8") as newfile1:
            json.dump(url_data, newfile1)