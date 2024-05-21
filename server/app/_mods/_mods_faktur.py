from flask import jsonify, make_response, request
from app.db_conn import connect_db, connect_db_server


class Faktur:
    @staticmethod
    def get_all_faktur():
        conn = connect_db_server()
        cur = conn.cursor(as_dict=True)

        query = """
        SELECT f.dossier_, f.dgbk_ref, f.fak__ref, f.bkj__ref, f.peri_ref, f.kla__ref, f.cde___ap , c.naam____
        FROM hafgfk__ f
        INNER JOIN klabas__ c ON f.kla__ref = c.kla__ref
        """
        # query = "SELECT dossier_, dgbk_ref, fak__ref, bkj__ref, peri_ref, kla__ref, cde___ap FROM hafgfk__ WHERE cde___ap != '' LIMIT 10"
        cur.execute(query)
        result = cur.fetchall()
        if result is None:
            response, status = {"message": "Problem occured"}, 400
        else:
            response, status = {"data": result,
                                "message": "Data retrieved"}, 200
        cur.close()
        return make_response(jsonify(response), status)

    @staticmethod
    def get_faktur_by_id(id):
        if id is None:
            return make_response(jsonify({"message": "No data inside request body"}), 400)

        conn = connect_db_server()
        cur = conn.cursor(as_dict=True)

        query = """
        SELECT f.dossier_, f.dgbk_ref, f.fak__ref, f.bkj__ref, f.peri_ref, f.kla__ref, f.cde___ap , c.naam____
        FROM hafgfk__ f
        INNER JOIN klabas__ c ON f.kla__ref = c.kla__ref
        WHERE f.fak__ref=%s AND f.cde___ap != '';
        """
        cur.execute(query, (id))
        result = cur.fetchone()
        cur.close()
        if result is None:
            response = {"message": "No data with ID {}".format(id)}
        else:
            response = {"data": [result], "message": "Data retrieved"}
        cur.close()
        return make_response(jsonify(response), 200)

    @staticmethod
    def get_faktur_by_date(start_date, end_date):
        if start_date is None or end_date is None:
            return make_response(jsonify({"message": "No date"}), 400)
        
        conn = connect_db_server()
        cur = conn.cursor(as_dict=True)

        query = """
        SELECT f.dossier_, f.dgbk_ref, f.fak__ref, f.bkj__ref, f.peri_ref,f. kla__ref, f.cde___ap, c.naam____
        FROM hafgfk__ f
        INNER JOIN klabas__ c ON f.kla__ref = c.kla__ref
        WHERE f.dok__dat BETWEEN %s AND %s AND f.cde___ap != '';
        """
        cur.execute(query, (start_date, end_date))
        result = cur.fetchall()
        cur.close()
        if result is None:
            response = {"message": "No data between {} and {}".format(
                start_date, end_date)}
        else:
            response = {"data": result,
                        "message": "Data retrieved"}
        cur.close()
        return make_response(jsonify(response), 200)

    @staticmethod
    def remove_faktur():
        # Req Body
        data = request.get_json()
        if data is None:
            return make_response(jsonify({"message": "No data inside request body"}), 400)
        id = data['id']
        year = data['year']
        alasan = data['alasan']

        conn = connect_db_server()
        cur = conn.cursor()

        # Get cde___ap (faktur pajak)
        query = "SELECT cde___ap FROM hafgfk__ WHERE fak__ref = %s AND bkj__ref=%s"
        cur.execute(query, (id, year))
        fp = cur.fetchone()
        
        # Remove faktur pajak
        query = "UPDATE hafgfk__ SET cde___ap = '' WHERE fak__ref = %s AND bkj__ref=%s"
        cur.execute(query, (id, year))
        query = "UPDATE vkpvlg__ SET dgbk_ref = '', bkj__ref = '', fak__ref = '' WHERE fak__ref=%s AND bkj__ref=%s"
        cur.execute(query, (id, year))

        # msg = cur.messages
        result = cur.rowcount
        if result == 1:
            msg = "Value {} is removed".format(id)
            Faktur.insert_new_log(id, fp[0], alasan)
        else:
            msg = "There is no value"
        response, status = {"message": msg}, 200
        
        cur.close()
        conn.commit()

        return make_response(jsonify(response), status)
    
    @staticmethod
    def insert_new_log(invoice_id, no_faktur, alasan):
        conn = connect_db()
        cur = conn.cursor()
        
        query = "INSERT INTO log_del_fp (user_id, no_inv, no_fps, alasan, tgl_remove, jam_remove) VALUES (1, %s, %s, %s, CURDATE(), CURTIME())"
        cur.execute(query, (invoice_id, no_faktur, alasan))
        
        result = cur.rowcount
        if result == 1:
            msg = "Log remove faktur {} added".format(invoice_id)
        else:
            msg = "There is no value"
        response, status = {"message": msg}, 200
        cur.close()
        conn.commit()
        return make_response(jsonify(response), status)

    @staticmethod
    def get_all_logs():
        conn = connect_db()
        cur = conn.cursor()

        query = "SELECT user_id, no_inv, no_fps, alasan, tgl_remove, jam_remove FROM log_del_fp WHERE tgl_remove = CURDATE() ORDER BY tgl_remove DESC, jam_remove DESC"
        cur.execute(query)
        result = cur.fetchall()
        if result is None:
            response, status = {"message": "Problem occured"}, 400
        else:
            response, status = {"data": result,
                                "message": "Data retrieved"}, 200
        
        for row in result:
            row['tgl_remove'] = row['tgl_remove'].strftime("%d %b %Y")
            row['jam_remove'] = str(row['jam_remove'])

        cur.close()
        return make_response(jsonify(response), status)
    
    # @staticmethod
    # def get_log_by_id(id):
    #     if id is None:
    #         return make_response(jsonify({"message": "No data inside request body"}), 400)

    #     conn = connect_db()
    #     cur = conn.cursor()

    #     query = "SELECT user_id, no_inv, no_fps, alasan, tgl_remove, jam_remove FROM log_del_fp WHERE no_inv=%s"
    #     cur.execute(query, (id))
    #     result = cur.fetchone()
    #     cur.close()
    #     if result is None:
    #         response = {"message": "No data with ID {}".format(id)}
    #     else:
    #         response = {"data": [result], "message": "Data retrieved"}
    #         result['tgl_remove'] = result['tgl_remove'].strftime("%d %b %Y")
    #         result['jam_remove'] = str(result['jam_remove'])
        
    #     cur.close()
    #     return make_response(jsonify(response), 200)