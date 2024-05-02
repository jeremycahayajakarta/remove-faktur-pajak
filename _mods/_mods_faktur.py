from flask import jsonify, make_response, request
from db_conn import connect_db

class Faktur:
    @staticmethod
    def get_all_faktur():
        conn = connect_db()
        cur = conn.cursor()
        query = "SELECT dossier_, dgbk_ref, fak__ref, bkj__ref, peri_ref, kla__ref, cde___ap FROM hafgfk__ LIMIT 10"
        cur.execute(query)
        result = cur.fetchall()
        if result is None:
            response, status = {"message": "Problem occured"}, 500
        else:
            response, status = {"data": result, "message": "Data retrieved"}, 200
        cur.close()
        return make_response(jsonify(response)), status

    @staticmethod
    def get_faktur(id):
        conn = connect_db()
        cur = conn.cursor()
        query = "SELECT dossier_, dgbk_ref, fak__ref, bkj__ref, peri_ref, kla__ref, cde___ap FROM hafgfk__ WHERE fak__ref=%s"
        cur.execute(query, (id))
        result = cur.fetchone()
        cur.close()
        if result is None:
            response, status = {"message": "Problem occured"}, 500
        else:
            response, status = {"data": result, "message": "Data retrieved"}, 200
        cur.close()
        return make_response(jsonify(response)), status
    
    @staticmethod
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
            log = "INSERT INTO log_del_fp (user_id, no_inv, no_fps, alasan, tgl_remove, jam_remove) VALUES (1, 2, 3, 'Hapus faktur', CURDATE(), CURTIME())"
            cur.execute(log)
        else:
            msg = "There is no value"
        response, status = {"message": msg}, 200
        cur.close()
        conn.commit()

        return make_response(jsonify(response)), status