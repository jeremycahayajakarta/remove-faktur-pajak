from flask import Flask
from app._route._route_faktur import faktur

app = Flask(__name__)

app.register_blueprint(faktur)