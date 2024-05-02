from flask import Flask
from _mods._mods_faktur import Faktur

app = Flask(__name__)

# Remove Faktur


@app.route('/faktur')
def get_all_faktur():
    return Faktur.get_all_faktur()


@app.route('/faktur/<id>')
def get_faktur(id):
    return Faktur.get_faktur(id)


@app.route('/remove', methods=['POST'])
def remove_faktur():
    return Faktur.remove_faktur()


if __name__ == '__main__':
    app.run(debug=True)
