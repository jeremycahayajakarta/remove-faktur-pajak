
from flask import Blueprint
from .._mods._mods_faktur import Faktur

faktur = Blueprint('faktur', __name__)


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
