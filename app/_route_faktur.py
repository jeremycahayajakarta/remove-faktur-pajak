
from app import app
from _mods._mods_faktur import Faktur


@app.route('/faktur', methods=['GET'])
def get_all_faktur():
    return Faktur.get_all_faktur()


@app.route('/faktur/id', methods=['GET'])
def get_faktur_by_id():
    return Faktur.get_faktur_by_id()


@app.route('/faktur/date', methods=['GET'])
def get_faktur_by_date():
    return Faktur.get_faktur_by_date()


@app.route('/remove', methods=['POST'])
def remove_faktur():
    return Faktur.remove_faktur()


@app.route('/log', methods=['GET'])
def get_all_logs():
    return Faktur.get_all_logs()
