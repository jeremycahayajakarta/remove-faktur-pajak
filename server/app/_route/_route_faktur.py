
from flask import Blueprint, render_template, request
from .._mods._mods_faktur import Faktur
from flask_cors import cross_origin

faktur = Blueprint('faktur', __name__)

@faktur.route('/')
def home():
    return render_template('home.html')

@faktur.route('/faktur', methods=['GET'])
@cross_origin()
def get_all_faktur():
    return Faktur.get_all_faktur()

@faktur.route('/get_faktur_by_id', methods=['GET'])
@cross_origin()
def get_faktur_by_id():
    id = request.args.get('id')
    return Faktur.get_faktur_by_id(id)

@faktur.route('/get_faktur_by_date', methods=['GET'])
@cross_origin()
def get_faktur_by_date():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    return Faktur.get_faktur_by_date(start_date, end_date)

@faktur.route('/remove_faktur', methods=['POST'])
@cross_origin()
def remove_faktur():
    return Faktur.remove_faktur()

@faktur.route('/get_all_logs', methods=['GET'])
@cross_origin()
def get_all_logs():
    return Faktur.get_all_logs()

@faktur.route('/export_faktur', methods=['GET', 'POST'])
@cross_origin()
def export_faktur():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    return Faktur.export_csv(start_date, end_date)