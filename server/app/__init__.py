from flask import Flask
from flask_cors import CORS
from app._route._route_faktur import faktur

app = Flask(__name__)
cors = CORS(app, origins=['http://192.168.31.118:3000'])

app.register_blueprint(faktur)