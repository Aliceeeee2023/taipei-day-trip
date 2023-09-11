import mysql.connector, json

con = mysql.connector.connect(
    user="root",
    password="123456",
    host="localhost",
    database="taipei_day_trip"
)

def insert_category():
    with open("attractions.json", mode="r", encoding="utf-8") as file:
        data = json.load(file)

    cursor = con.cursor()

    try:
        for i in data:
            detail = i["category"]

            cursor.execute("SELECT name FROM category WHERE name=%s", (detail,))
            category = cursor.fetchone()

            if category is None:
                cursor.execute("INSERT INTO category(name) VALUE(%s)", (detail,))
                con.commit()

    except Exception as error:
        print(error)
        con.rollback()

    finally:
        con.close()


def insert_mrt():
    with open("attractions.json", mode="r", encoding="utf-8") as file:
        data = json.load(file)

    cursor = con.cursor()

    try:
        for i in data:
            detail = i["mrt"]

            if detail is None:
                mrt_name = "沒有資料"
            else:
                mrt_name = i["mrt"]

            cursor.execute("SELECT name FROM mrt WHERE name=%s", (mrt_name,))
            mrt = cursor.fetchone()

            if mrt is None:
                cursor.execute("INSERT INTO mrt(name) VALUE(%s)", (mrt_name,))
                con.commit()

    except Exception as error:
        print(error)
        con.rollback()

    finally:
        con.close()


def insert_images():
    with open("final-url.json", mode="r", encoding="utf-8") as file:
        data = json.load(file)

    cursor = con.cursor()

    try:
        for i in data:
            id = i["id"]
            detail = i["images"]

            cursor.execute("SELECT url FROM images WHERE url=%s", (detail,))
            url = cursor.fetchone()

            if url is None:
                cursor.execute("INSERT INTO images(attractions_id, url) VALUE(%s, %s)", (id, detail))
                con.commit()

    except Exception as error:
        print(error)
        con.rollback()

    finally:
        con.close()


def insert_attractions():
    with open("attractions.json", mode="r", encoding="utf-8") as file:
        data = json.load(file)

    cursor = con.cursor()

    try:
        for i in data:
            id = i["id"]
            name = i["name"]
            description = i["description"]
            address = i["address"]
            transport = i["transport"]
            lat = i["lat"]
            lng = i["lng"]
            category = i["category"]
            mrt = i["mrt"]

            cursor.execute("SELECT id FROM category WHERE name=%s", (category,))
            category_id = cursor.fetchone()
            cursor.execute("SELECT id FROM mrt WHERE name=%s", (mrt,))
            mrt_data = cursor.fetchone()

            if mrt_data is not None:
                mrt_id = mrt_data[0]
            else:
                mrt_id = "20" # 沒資料情況的編號

            cursor.execute("SELECT name FROM attractions WHERE name=%s", (name,))
            check_name = cursor.fetchone()

            if check_name is None:
                cursor.execute("INSERT INTO attractions(id, name, category_id, description, address, transport, mrt_id, lat, lng) VALUE(%s, %s, %s, %s, %s, %s, %s, %s, %s)", (id, name, category_id[0], description, address, transport, mrt_id, lat, lng))
                con.commit()

    except Exception as error:
        print(error)
        con.rollback()

    finally:
        con.close()