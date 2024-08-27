import os
import openai
import uuid
from dotenv import load_dotenv

from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from db import get_session, init_db
from tables import User, WorkExperience, Skill, Template
from hashlib import md5
from utils import get_resume_from_db, save_template_file, save_profile_image
from flask import Flask, request, jsonify, send_from_directory

load_dotenv()
app = Flask("CV-builder")

openai.api_key = os.getenv("OPEN_API_KEY")
openai.base_url = os.getenv("OPEN_API_BASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URI")


db = SQLAlchemy(app)


# @app.teardown_appcontext
# def shutdown_session(exception=None):
#     with get_session as session:
#         session.remove()


@app.route("/")
@app.route("/home")
def index():
    DB_FILE_PATH = os.environ.get("DB_FILE_PATH")
    if not os.path.exists(DB_FILE_PATH):
        init_db()
    return render_template("index.html")


@app.route("/signup")
def signup():
    with get_session as session:
        user = User(
        name="Hein Min 2 Maw",
        email="heinmin2maw.it@gmail.com",
        password="Heinmin2maw123#",
        )

        session.add(user)
        session.commit()
    return "Done successfully"


@app.route("/users/get")
def get_user():
    return User.query.all()

    # User.query.filter(User.name == 'admin').first()

#=========== Resume APIs ================

@app.route("/resume/select-template")
def resume_template():
    templates_svg_files = {
        'template1': 'static/images/resume/template1.svg',
        'template2': 'static/images/resume/template2.svg',
        'template3': 'static/images/resume/template3.svg'
    }

    contents = {"template_svg_files": [], "other_data": "example_value"}
    
    for key, file_path in templates_svg_files.items():
        with open(file_path, 'r') as file:
            svg_file = {key: file.read()}
            contents["template_svg_files"].append(svg_file)
          
    return render_template("resume.html", contents=contents)

@app.route("/resume/<int:resume_id>", methods=["GET"])
def get_resume(resume_id):
    resume = get_resume_from_db(resume_id)   
    return render_template("resume_template.html", resume=resume)






# Profile Image API 

@app.route("/profile/upload", methods=['POST'])
def upload_profile():
    if 'profile-image' not in request.files:
        return jsonify({"success": False, "message":"No File part"}), 400
    profile_img_file = request.files['profile-image']
    
    
    profile_folder_path = os.environ.get("PROFILE_FILE_PATH")
    
    file_name, file_path = save_profile_image(file=profile_img_file, upload_folder_path=profile_folder_path)
    if file_name is None:
        return  jsonify({"success": False, "message":"Invalid file type"}), 400
 
    return jsonify({"success": True, "file_name":file_name}), 200
    

@app.route("/profile/<string:file_name>", methods=['GET'])
def get_profile(file_name:str):
    if file_name == "":
        return  jsonify({"success": False, "message":"Invalid file type"}), 400
    
    profile_folder_path = os.environ.get("PROFILE_FILE_PATH")
    try:
        return send_from_directory(profile_folder_path, file_name)
    except FileNotFoundError:
        return jsonify({"success": False, "message": "File not found"}), 404
  
 
    
    
@app.route("/template/upload", methods=["POST"])
def upload_template():
  
    if 'template_file' not in request.files:
        return "No file part", 400
    
    template_file = request.files['template_file']
    
    template_folder_path = os.environ.get("TEMPLATE_FILE_PATH")
    
    file_name, file_path = save_template_file(file=template_file, upload_folder_path=template_folder_path)
    if file_name is None:
        return "Invalid file type", 400
    
    with get_session() as session:
        template = Template(file_name=file_name, file_path=file_path)
        session.add(template)
        session.commit()
    
        return f"File uploaded successfully: {file_name}", 200
    
    return "Failed to save file to db", 500


# ========== Template APIs ==========
@app.route("/template/<string:template_id>", methods=["GET"])
def get_template_html(template_id):
 
    template_path = f"templates/resume-templates/{template_id}.html"
    try:
        with open(template_path, 'r') as file:
            template = file.read()
    except FileNotFoundError:
        return "Template not found", 404

    return template


    
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

   
    
@app.route("/auth/template", methods=["GET"])
def template_page():
    return render_template("template-uploader.html")


# =============================================
#  Render Page APIs for Resume section pages 
# =============================================
@app.route("/resume/section/heading",  methods=["GET"])
def render_heading_page():
    return render_template("header-resume.html")


@app.route("/resume/section/education",  methods=["GET"])
def render_education_page():
    return render_template("edu-resume.html")

@app.route("/resume/section/work_experience",  methods=["GET"])
def render_work_experience_page():
    return render_template("work-exp-resume.html")

@app.route("/resume/section/skill",  methods=["GET"])
def render_skill_page():
    return render_template("skill-resume.html")

if __name__ == "__main__":
    app.debug