from flask import jsonify, make_response, Response, request, send_file, send_from_directory
from app.db_conn import connect_db, connect_db_server
import pandas as pd
import os
from io import BytesIO

EXPORT_CSV_PATH = os.path.join(os.getcwd(), 'app\\public\\csv')

class Faktur:
    @staticmethod
    def get_faktur_by_id(id):
        if id is None:
            return make_response(jsonify({"message": "No data inside request body"}), 400)

        conn = connect_db_server()
        cur = conn.cursor(as_dict=True)
        
        query = """
        SELECT f.dossier_ AS site, f.dgbk_ref AS jurnal_id, 
        f.fak__ref AS invoice_id, f.bkj__ref AS year, 
        f.peri_ref AS periode, f.kla__ref AS cust_id, 
        f.cde___ap AS no_faktur, f.user____ AS user_name,  
        c.naam____ AS cust_name
        FROM hafgfk__ f
        INNER JOIN klabas__ c ON f.kla__ref = c.kla__ref
        WHERE f.fak__ref=%s AND f.cde___ap != '';
        """
        cur.execute(query, (id))
        result = cur.fetchall()
        cur.close()
        
        if len(result) == 0:
            response = {"status": 0, "message": "Invoice ID {} could not be found.".format(id)}
        else:
            response = {"status": 1, "faktur": result}
        return make_response(jsonify(response), 200)
    
    @staticmethod
    def get_faktur_by_date(start_date, end_date):
        if start_date is None or end_date is None:
            return make_response(jsonify({"status": 0, "message": "No date"}), 400)
        
        conn = connect_db_server()
        cur = conn.cursor(as_dict=True)

        query = """
        SELECT f.dossier_ AS site, f.dgbk_ref AS jurnal_id, 
        f.fak__ref AS invoice_id, f.bkj__ref AS year, 
        f.peri_ref AS periode, f.kla__ref AS cust_id, 
        f.cde___ap AS no_faktur, f.user____ AS user_name,  
        c.naam____ AS cust_name
        FROM hafgfk__ f
        INNER JOIN klabas__ c ON f.kla__ref = c.kla__ref
        WHERE f.dok__dat BETWEEN %s AND %s AND f.cde___ap != '';
        """
        cur.execute(query, (start_date, end_date))
        result = cur.fetchall()
        cur.close()
        
        if len(result) == 0:
            response = {"status": 0, "message": "No invoice data between {} and {}.".format(
                start_date, end_date)}
        else:
            response = {"status": 1, "faktur": result}
        return make_response(jsonify(response), 200)
    
    @staticmethod
    def remove_faktur():
        # Req Body
        data = request.get_json()
        if data is None:
            return make_response(jsonify({"status": 0, "message": "No data inside request body"}), 400)
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
            Faktur.insert_new_log(id, fp[0], alasan)
            response = {"status": 1, "message": "Value {} is removed".format(id)}
        else:
            response = {"status": 0, "message": "There is no value"}
        
        cur.close()
        conn.commit()

        return make_response(jsonify(response), 200)
    
    @staticmethod
    def insert_new_log(invoice_id, no_faktur, alasan):
        conn = connect_db()
        cur = conn.cursor()
        
        # user_name = session['username']

        query = "INSERT INTO log_del_fp (user_name, no_inv, no_fps, alasan, tgl_remove, jam_remove) VALUES ('1', %s, %s, %s, CURDATE(), CURTIME())"
        cur.execute(query, (invoice_id, no_faktur, alasan))
        
        result = cur.rowcount
        if result == 1:
            msg = "Log remove faktur {} added".format(invoice_id)
        else:
            msg = "There is no value"
        response, status = {"status": 1, "message": msg}, 200
        
        cur.close()
        conn.commit()
        return make_response(jsonify(response), status)
    
    @staticmethod
    def get_all_logs():
        conn = connect_db()
        cur = conn.cursor()

        query = """
        SELECT user_name, no_inv, no_fps, alasan, tgl_remove, jam_remove 
        FROM log_del_fp 
        WHERE tgl_remove = CURDATE() 
        ORDER BY tgl_remove DESC, jam_remove DESC
        """
        cur.execute(query)
        result = cur.fetchall()
        
        if result is None:
            response, status = {"status": 0, "message": "Problem occured"}, 400
        else:
            new_response = []
            for row in result:
                tgl_remove_edited = row[4].strftime("%d %b %Y")
                row_dict = dict([('user_name', row[0]), ('no_inv', row[1]), ('no_fps', row[2]), ('alasan', row[3]), ('tgl_remove', tgl_remove_edited), ('jam_remove', str(row[5]))])
                new_response.append(row_dict)
            response, status = {"status": 1, "log": new_response}, 200
            
        cur.close()
        return make_response(jsonify(response), status)
    
    @staticmethod
    def export_csv(start_date, end_date):
        conn = connect_db_server()
        cur = conn.cursor(as_dict=True)
        
        query = """
        SELECT f.dossier_ AS site, f.dgbk_ref AS jurnal_id, 
        f.fak__ref AS invoice_id, f.bkj__ref AS year, 
        f.peri_ref AS periode, f.kla__ref AS cust_id, 
        f.cde___ap AS no_faktur, f.user____ AS user_name,  
        c.naam____ AS cust_name
        FROM hafgfk__ f
        INNER JOIN klabas__ c ON f.kla__ref = c.kla__ref
        WHERE f.dok__dat BETWEEN %s AND %s AND f.cde___ap != '';
        """
        
        cur.execute(query, (start_date, end_date))
        result = cur.fetchall()
        cur.close()
        
        
        if len(result) > 0:
            json_data = {"faktur": result}
            # Making dataframe from response json
            df = pd.DataFrame(json_data["faktur"])
            # Export to CSV
            # response_stream = BytesIO(df.to_csv(index=False).encode())
            # path_file = os.path.join(os.getcwd(), "app\\public\\csv")
            # print(path_file)
            file_name = os.path.join(EXPORT_CSV_PATH, 'faktur_data_{}_{}.csv'.format(start_date, end_date))
            df.to_csv(file_name, index=False)
            
            return send_from_directory(
                EXPORT_CSV_PATH, path='faktur_data_{}_{}.csv'.format(start_date, end_date), as_attachment=True
            )
            return send_file(
                response_stream,
                # path_or_file=path_file,
                mimetype="text/csv",
                download_name="export.csv",
                as_attachment=True
            )
            
            response = Response()
            # response = {"status": 1, "message": "CSV file is exported!"}
            response.headers["Content-Disposition"] = "attachment; faktur_data_{}_{}.csv".format(start_date, end_date)
            response.headers["Content-type"] = "text/csv"
        else: 
            response = {"status": 0, "message": "CSV file couldn't be exported, no invoice data between {} and {}.".format(start_date, end_date)}
        
        return response