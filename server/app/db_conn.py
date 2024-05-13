import pymysql
import pymssql

def connect_db():
    conn = pymysql.connect(
        host='localhost',
        user='root',
        password='cahaya',
        database='faktur',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor)
    return conn

def connect_db_server():
    conn = pymssql.connect(
        server="CERM-DATA\CRMDB",
        user="Cermsys",
        password="SysCerm01.",
        database="sqlb00test",
        tds_version="7.0")
    return conn