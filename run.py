from flask import Flask, session
from init import app, db
from models import User, Goal, Task
from flask_session import Session

# Configure the session
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SECRET_KEY'] = '123456'

# Initialize the session
Session(app)

# Create the database tables if they do not exist
with app.app_context():
    db.create_all()

# Define the main entry point of the application
if __name__ == '__main__':
    app.run(debug=True)