from flask import jsonify, make_response, Response, request, send_file, send_from_directory
from app.db_conn import connect_db, connect_db_server
import pandas as pd
import os
from io import BytesIO
import xlsxwriter
from werkzeug.datastructures import Headers

EXPORT_CSV_PATH = os.path.join(os.getcwd(), 'app\\public\\csv')
EXPORT_EXCEL_PATH = os.path.join(os.getcwd(), 'app\\public\\excel')

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
            output = BytesIO()
            json_data = {"faktur": result}
            # Making dataframe from response json
            df = pd.DataFrame(json_data["faktur"])
            
            # Export to CSV
            file_name = os.path.join(EXPORT_CSV_PATH, 'DATA_FAKTUR_{}_{}.csv'.format(start_date, end_date))
            df.to_csv(file_name, index=False)
            
            with open(file_name, 'rb') as f:
                output.write(f.read())
                
            output.seek(0)
            os.remove(file_name)
            
            return send_file(
                output, 
                mimetype='text/csv', 
                as_attachment=True, 
                download_name='DATA_FAKTUR_{}_{}.csv'.format(start_date, end_date)
            )
            return send_from_directory(
                EXPORT_CSV_PATH, path='DATA_FAKTUR_{}_{}.csv'.format(start_date, end_date), as_attachment=True
            )
        else: 
            response = {"status": 0, "message": "CSV file couldn't be exported, no invoice data between {} and {}.".format(start_date, end_date)}
        
        return response
    
    @staticmethod
    def export_excel(start_date, end_date):
        # Querying the data
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
            output = BytesIO()
            response = Response()
            # Making a workbook for Excel
            workbook = xlsxwriter.Workbook(output, {'in_memory': True})
            worksheet = workbook.add_worksheet()
            
            # Make columns
            worksheet.set_column("A:A", 10) # No
            worksheet.set_column("B:B", 10) # Site
            worksheet.set_column("C:C", 10) # Jurnal ID
            worksheet.set_column("D:D", 10) # Invoice ID
            worksheet.set_column("E:E", 10) # Year
            worksheet.set_column("F:F", 10) # Periode
            worksheet.set_column("G:G", 20) # Customer ID
            worksheet.set_column("H:H", 50) # Customer Name
            worksheet.set_column("I:I", 20) # Faktur Pajak
            worksheet.set_column("J:J", 10) # User
            
            # Format
            column_header_format = workbook.add_format({
                'bold': True, 
                'align': 'center', 
                'bg_color': '#CCCCCC',
                'border': True
            })
            bold_format = workbook.add_format({'bold': True})
            row_format = workbook.add_format({'align': 'center', 'border': True})
            
            row_num = 4
            num = 1
            alphabet = 65 # A = 65, Z = 90
            
            # Header
            worksheet.merge_range("A1:J1", "DATA FAKTUR PAJAK {} S.D {}".format(start_date, end_date), bold_format)
            
            # Column Header
            columns = ["NO", "SITE", 
                    "JURNAL ID", "INVOICE ID", 
                    "YEAR", "PERIODE", 
                    "CUSTOMER ID", "CUSTOMER NAME", 
                    "NO. FAKTUR", "USER"]
            
            for col in columns:
                worksheet.write("{}{}".format(chr(alphabet), 3), col, column_header_format)
                alphabet += 1
            
            # Build row data
            for row in result:
                worksheet.write('A{}'.format(str(row_num)), str(num), row_format)
                worksheet.write('B{}'.format(str(row_num)), row['site'], row_format)
                worksheet.write('C{}'.format(str(row_num)), row['jurnal_id'], row_format)
                worksheet.write('D{}'.format(str(row_num)), row['invoice_id'], row_format)
                worksheet.write('E{}'.format(str(row_num)), row['year'], row_format)
                worksheet.write('F{}'.format(str(row_num)), row['periode'], row_format)
                worksheet.write('G{}'.format(str(row_num)), row['cust_id'], row_format)
                worksheet.write('H{}'.format(str(row_num)), row['cust_name'], row_format)
                worksheet.write('I{}'.format(str(row_num)), row['no_faktur'], row_format)
                worksheet.write('J{}'.format(str(row_num)), row['user_name'], row_format)
                row_num += 1
                num += 1
            
            workbook.close()
            
            # file_name = os.path.join(EXPORT_EXCEL_PATH, 'faktur_data_{}_{}.xlsx'.format(start_date, end_date))
            file_name = 'DATA_FAKTUR_{}_{}.xlsx'.format(start_date, end_date)
            
            output.seek(0)
            response = make_response(output.read())
            response.headers['Content-Disposition'] = 'attachment; filename={}'.format(file_name)
            response.headers['Content-Type'] = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            response.set_cookie('fileDownload', 'true', path='/')
            
            return response
        else: 
            response = {"status": 0, "message": "CSV file couldn't be exported, no invoice data between {} and {}.".format(start_date, end_date)}
        