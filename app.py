from flask import *
import mysql.connector.pooling, json, jwt, datetime

dbconfig = {
    "user" : "root",
    "password" : "wehelp20230903",
    "host" : "localhost",
    "database" : "taipei_day_trip"
}

connection_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="pool", pool_size=10, **dbconfig)

app = Flask(__name__, static_folder="static", static_url_path="/static")
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["JSON_SORT_KEYS"] = False

secret_key = "test"

# Pages
@app.route("/")
def index():
	return render_template("index.html")

@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")

@app.route("/booking")
def booking():
	return render_template("booking.html")

@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

# Function（用 id 比對後將 url 統整成 list）
def create_images_list():
	connection = connection_pool.get_connection()
	cursor = connection.cursor(dictionary=True)

	try:
		cursor.execute("SELECT attractions_id, url FROM images")
		url_data = cursor.fetchall()

		final_data = {}
		for detail in url_data:
			id = detail["attractions_id"]
			url = detail["url"]

			if id in final_data:
				final_data[id]["url"].append(url)
			else:
				final_data[id] = {"id": id, "url": [url]}

		result = list(final_data.values())
		return result
	except Exception as error:
		print(error)
		connection.rollback()
	finally:
		cursor.close()
		connection.close()		

# Function（把 url 的 list 加入資料）
def add_images_to_data(data, result):		
		for compare_data in data:
			data_id = compare_data["id"]

			for images_data in result:
				if data_id == images_data["id"]:
					compare_data["images"] = images_data["url"]
		return data

# API
@app.route("/api/attractions")
def attractions_list():
	connection = connection_pool.get_connection()
	cursor = connection.cursor(dictionary=True)

	try:
		page = int(request.args.get("page", 0))
		keyword = request.args.get("keyword", None)

		offset = page * 12
		nextoffset = (page+1) * 12

		if keyword is None:
			query = """
			SELECT a.id, a.name, a.description, a.address, a.transport, a.lat, a.lng, c.name AS category, m.name AS mrt
			FROM attractions AS a
			INNER JOIN category AS c ON a.category_id=c.id
			INNER JOIN mrt AS m ON a.mrt_id=m.id
			ORDER BY a.id ASC
			LIMIT 12 OFFSET %s
			"""
			cursor.execute(query, (offset,))
			data = cursor.fetchall()

			cursor.execute(query, (nextoffset,))
			nextdata = cursor.fetchall()

			result = create_images_list()
			final_data = add_images_to_data(data, result)

			if nextdata:
				return jsonify({"nextPage" : page + 1, "data" : final_data})
			else:
				return jsonify({"nextPage" : None, "data" : final_data})				
		else:
			check_keyword = """
			SELECT a.id, a.name, a.description, a.address, a.transport, a.lat, a.lng, c.name AS category, m.name AS mrt
			FROM attractions AS a
			INNER JOIN category AS c ON a.category_id=c.id
			INNER JOIN mrt AS m ON a.mrt_id=m.id
			WHERE m.name=%s OR a.name LIKE %s
			ORDER BY a.id ASC
			LIMIT 12 OFFSET %s
			"""
			cursor.execute(check_keyword, (keyword, "%" + keyword + "%", offset))
			data = cursor.fetchall()

			cursor.execute(check_keyword, (keyword, "%" + keyword + "%", nextoffset))
			nextdata = cursor.fetchall()

			result = create_images_list()
			final_data = add_images_to_data(data, result)

			if nextdata:
				return jsonify({"nextPage" : page + 1, "data" : final_data})
			else:
				return jsonify({"nextPage" : None, "data" : final_data})				
	except Exception as error:
		print(error)
		connection.rollback()

		error_data = {
			"error": True,
 			"message": "伺服器內部錯誤"
		}
		return jsonify(error_data), 500
	finally:
		cursor.close()
		connection.close()

@app.route("/api/attraction/<int:attractionId>")
def attractions_id(attractionId):
	connection = connection_pool.get_connection()
	cursor = connection.cursor(dictionary=True)

	try:
		query = """
		SELECT a.id, a.name, a.description, a.address, a.transport, a.lat, a.lng, c.name AS category, m.name AS mrt
		FROM attractions AS a
		INNER JOIN category AS c ON a.category_id=c.id
		INNER JOIN mrt AS m ON a.mrt_id=m.id
		WHERE a.id=%s
		"""
		cursor.execute(query, (attractionId, ))
		data = cursor.fetchall()

		if not data:
			attractionId_not_found = {
				"error": True,
				"message": "景點編號不正確"
			}
			return jsonify(attractionId_not_found), 400
		else:
			result = create_images_list()
			final_data = add_images_to_data(data, result)

			return jsonify({"data" : final_data[0]})
	except Exception as error:
		print(error)
		connection.rollback()

		error_data = {
			"error": True,
 			"message": "伺服器內部錯誤"
		}
		return jsonify(error_data), 500
	finally:
		cursor.close()
		connection.close()

@app.route("/api/mrts")
def mrts_list():
	connection = connection_pool.get_connection()
	cursor = connection.cursor(dictionary=True)

	try:
		query = """
		SELECT m.name AS mrt
		FROM attractions AS a
		INNER JOIN mrt AS m ON a.mrt_id=m.id
		GROUP BY mrt
		ORDER BY COUNT(*) DESC
		"""
		cursor.execute(query)
		data = cursor.fetchall()

		final_data = []
		for detail in data:
			mrt_name = detail["mrt"]
			if mrt_name != "沒有資料":
				final_data.append(mrt_name)

		return jsonify({"data" : final_data})		
	except Exception as error:
		print(error)
		connection.rollback()

		error_data = {
			"error": True,
 			"message": "伺服器內部錯誤"
		}
		return jsonify(error_data), 500		
	finally:
		cursor.close()
		connection.close()

@app.route("/api/user", methods=["POST"])
def create_user():
	connection = connection_pool.get_connection()
	cursor = connection.cursor(dictionary=True)	

	try:
		data = request.get_json()
		name = data["name"]
		email = data["email"]
		password = data["password"]

		query = "SELECT email FROM users WHERE email=%s"
		cursor.execute(query, (email, ))
		select_data = cursor.fetchall()

		if not name or not email or not password:
			wrong_message = {
				"error": True,
				"message": "註冊資料不得為空"
			}

			return jsonify(wrong_message), 400
		elif not select_data:
			query = "INSERT INTO users(name, email, password) VALUES(%s, %s, %s)"
			cursor.execute(query, (name, email, password))
			connection.commit()

			return jsonify({"ok" : True}), 200
		else:
			wrong_message = {
				"error": True,
				"message": "此Email已被註冊過"
			}

			return jsonify(wrong_message), 400			
	except Exception as error:
		print(error)
		connection.rollback()

		error_message = {
			"error": True,
 			"message": "伺服器內部錯誤"
		}
		return jsonify(error_message), 500		
	finally:
		cursor.close()
		connection.close()

@app.route("/api/user/auth", methods=["PUT"])
def login():
	connection = connection_pool.get_connection()
	cursor = connection.cursor(dictionary=True)	

	try:
		data = request.get_json()
		email = data["email"]
		password = data["password"]

		query = "SELECT email, password FROM users WHERE email=%s"
		cursor.execute(query, (email, ))
		select_data = cursor.fetchone()

		if select_data and password == select_data["password"]:
			payload = {
				"email": email,
				"password": password,
				"exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
			}
			token = jwt.encode(payload, secret_key, algorithm="HS256")

			return jsonify({"token" : token}), 200
		elif select_data and password != select_data["password"]:
			wrong_message = {
				"error": True,
				"message": "密碼輸入錯誤"
			}

			return jsonify(wrong_message), 400
		elif not select_data:
			wrong_message = {
				"error": True,
				"message": "Email輸入錯誤"
			}

			return jsonify(wrong_message), 400
	except Exception as error:
		print(error)
		connection.rollback()

		error_message = {
			"error": True,
 			"message": "伺服器內部錯誤"
		}

		return jsonify(error_message), 500		
	finally:
		cursor.close()
		connection.close()

@app.route("/api/user/auth", methods=["GET"])
def checkUsers():
	connection = connection_pool.get_connection()
	cursor = connection.cursor(dictionary=True)

	try:
		authorization_header = request.headers.get("Authorization")
		bearer_token = authorization_header.split(" ")[1]

		if bearer_token == "null":
			return jsonify({"data" : None}), 200

		payload = jwt.decode(bearer_token, secret_key, algorithms=['HS256'])
		email = payload["email"]
		password = payload["password"]

		query = "SELECT id, name, email, password FROM users WHERE email=%s AND password=%s"
		cursor.execute(query, (email, password))
		select_data = cursor.fetchone()

		if select_data:
			userData = {
				"id": select_data["id"],
				"name": select_data["name"],
				"email": select_data["email"]
			}

			return jsonify({"data" : userData}), 200
		else:
			return jsonify({"data" : None}), 200
	except Exception as error:
		print(error)
		connection.rollback()
	finally:
		cursor.close()
		connection.close()

app.run(host="0.0.0.0", port=3000, debug=True)