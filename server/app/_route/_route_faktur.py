
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
    if not request.args.get('id'):
        return Faktur.get_all_faktur()
    else:
        id = request.args.get('id')
        return Faktur.get_faktur_by_id(id)


@faktur.route('/faktur/date', methods=['GET'])
@cross_origin()
def get_faktur_by_date():
    return Faktur.get_faktur_by_date()


@faktur.route('/remove', methods=['POST'])
def remove_faktur():
    return Faktur.remove_faktur()


@faktur.route('/log', methods=['GET'])
def get_all_logs():
    return Faktur.get_all_logs()
