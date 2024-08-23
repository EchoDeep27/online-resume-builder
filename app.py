import os
import openai
from dotenv import load_dotenv

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from db import db_session, init_db
from models import User, WorkExperience, Skill
from hashlib import md5


load_dotenv()
app = Flask("CV-builder")

openai.api_key = os.getenv("OPEN_API_KEY")
openai.base_url = os.getenv("OPEN_API_BASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URI")

db = SQLAlchemy(app)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


@app.route("/")
def index():
    DB_FILE_PATH = os.environ.get("DB_FILE_PATH")
    if not os.path.exists(DB_FILE_PATH):
        init_db()
    return render_template("index.html")


@app.route("/signup")
def signup():
    user = User(
        name="Hein Min 2 Maw",
        email="heinmin2maw.it@gmail.com",
        password="Heinmin2maw123#",
    )

    db_session.add(user)
    db_session.commit()
    return "Done successfully"


@app.route("/users/get")
def get_user():
    return User.query.all()

    # User.query.filter(User.name == 'admin').first()


@app.route("/skills/get")
def get_skills():
    completion = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": "Can you generate 10 list of skill that a full-stack developer should have"},
        ],
    )

    print(completion.choices[0].message.content)
    return {"message":"success"}




if __name__ == "__main__":
    app.debug