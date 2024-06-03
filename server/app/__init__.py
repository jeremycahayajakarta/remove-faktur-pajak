from flask import Flask
from flask_cors import CORS
from app._route._route_faktur import faktur

app = Flask(__name__)
cors = CORS(app)

app.register_blueprint(faktur)