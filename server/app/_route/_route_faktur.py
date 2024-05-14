
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
    if request.args.get('id'):
        id = request.args.get('id')
        return Faktur.get_faktur_by_id(id)
    elif request.args.get('start_date') and request.args.get('end_date'):
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        return Faktur.get_faktur_by_date(start_date, end_date)
    else:
        return Faktur.get_all_faktur()


@faktur.route('/remove', methods=['POST'])
@cross_origin()
def remove_faktur():
    return Faktur.remove_faktur()


@faktur.route('/log', methods=['GET'])
def get_all_logs():
    return Faktur.get_all_logs()
