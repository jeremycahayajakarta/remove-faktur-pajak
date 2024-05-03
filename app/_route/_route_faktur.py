
from flask import Blueprint, render_template, jsonify
from .._mods._mods_faktur import Faktur
import json

faktur = Blueprint('faktur', __name__)

@faktur.route('/')
def home():
    return render_template('home.html')

@faktur.route('/get-all')
def get_all_faktur_template():
    data = get_all_faktur().response
    return render_template('faktur_pajak.html', data=json.loads(data[0].decode('utf-8'))['data'])

@faktur.route('/get-id')
def get_faktur_by_id_template():
    data = get_all_faktur().response
    return render_template('faktur_pajak.html', data=json.loads(data[0].decode('utf-8'))['data'])

@faktur.route('/faktur', methods=['GET'])
def get_all_faktur():
    return Faktur.get_all_faktur()


@faktur.route('/faktur/id', methods=['GET'])
def get_faktur_by_id():
    return Faktur.get_faktur_by_id()


@faktur.route('/faktur/date', methods=['GET'])
def get_faktur_by_date():
    return Faktur.get_faktur_by_date()


@faktur.route('/remove', methods=['POST'])
def remove_faktur():
    return Faktur.remove_faktur()


@faktur.route('/log', methods=['GET'])
def get_all_logs():
    return Faktur.get_all_logs()
