from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# app.config['SECRET_KEY'] = '0555i8hdjb13ae0qzdfdd1284ba180'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://b58ebd7db8ff0c:bac21d3a@us-cdbr-iron-east-01.cleardb.net/heroku_ebeccc9572a0df3'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://michaellu2019:Squatifa7.@regret-db.cdanwlm18f6n.us-east-2.rds.amazonaws.com/regret_db'
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('SQLALCHEMY_DATABASE_URI', '')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from app import routes