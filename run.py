from flask import Flask, session
from init import app, db
from models import User, Goal, Task
from flask_session import Session

# Define the main entry point of the application
if __name__ == '__main__':
    app.run(debug=True)
