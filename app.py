from flask import Flask, jsonify, request
import pymysql

app = Flask(__name__)

# Connect to DB
def connect_db():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='cahaya',
        database='faktur',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor)
    return conn

@app.route('/faktur')
def get_all_faktur():
    conn = connect_db()
    cur = conn.cursor()
    query = "SELECT dossier_, dgbk_ref, fak__ref, bkj__ref, peri_ref, kla__ref, cde___ap FROM hafgfk__ LIMIT 10"
    cur.execute(query)
    result = cur.fetchall()
    if result is None:
        response = {"status": 500, "message": "Problem occured"}
    else:
        response = {"status": 200, "data": result, "message": "Data retrieved"}
    return jsonify(response)

@app.route('/faktur/<id>')
def get_faktur(id):
    conn = connect_db()
    cur = conn.cursor()
    query = "SELECT dossier_, dgbk_ref, fak__ref, bkj__ref, peri_ref, kla__ref, cde___ap FROM hafgfk__ WHERE fak__ref=%s"
    cur.execute(query, (id))
    result = cur.fetchone()
    cur.close()
    if result is None:
        response = {"status": 500, "message": "Problem occured"}
    else:
        response = {"status": 200, "data": result, "message": "Data retrieved"}
    return jsonify(response)

@app.route('/remove', methods=['POST'])
def remove_faktur():
    # Arguments
    id = request.args.get('id')
    jurnal = request.args.get('jurnal')
    year = request.args.get('year')
    
    conn = connect_db()
    cur = conn.cursor()
    query = "UPDATE hafgfk__ SET cde___ap = '' WHERE fak__ref = %s AND dgbk_ref=%s AND bkj__ref=%s"
    cur.execute(query, (id, jurnal, year))
    query = "UPDATE vkpvlg__ SET dgbk_ref = '', bkj__ref = '', fak__ref = '' WHERE fak__ref=%s AND dgbk_ref=%s AND bkj__ref=%s"
    cur.execute(query, (id, jurnal, year))

    # msg = cur.messages
    result = cur.rowcount
    if result == 1:
        msg = "Value {} is removed".format(id)
    else:
        msg = "There is no value removed"
    response = {"status": 200, "message": msg}
    cur.close()
    conn.commit()

    return response


if __name__ == '__main__':
    app.run(debug=True)
