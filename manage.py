from flask.cli import FlaskGroup
from init import app, db

cli = FlaskGroup(app)

if __name__ == "__main__":
    cli()
