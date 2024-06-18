from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate 
from flask_session import Session

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = '123456'

# Initialize the database
db = SQLAlchemy(app)

# Initialize the session
Session(app)

migrate = Migrate(app, db)

import models

# Create the database tables if they do not exist
with app.app_context():
    db.create_all()





