import os
import re
import openai
import uuid
import json
from dotenv import load_dotenv

from flask_sqlalchemy import SQLAlchemy
from db import get_session, init_db

from tables import Resume, Template, User
from models import Resume as ResumeModel

from hashlib import md5
from utils import (
    add_address,
    get_template,
    replace_newlines,
    get_sample_resume,
    save_template_file,
    save_profile_image, 
    create_education_instances,
    create_language_instances,
    create_social_media_instances, 
    create_skill_instances,
    create_work_experience_instances
)

from flask import Flask, request, render_template, jsonify, send_from_directory, abort, Response, send_file
from sqlalchemy.orm import Session, joinedload

load_dotenv()
app = Flask("CV-builder")

openai.api_key = os.getenv("OPEN_API_KEY")
openai.base_url = os.getenv("OPEN_API_BASE_URL")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_URI")

db = SQLAlchemy(app)

app.jinja_env.filters['replace_newlines'] = replace_newlines


 
# ============================================
#  ========= APIs for Authentication =========
# ============================================

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

        
# =======================================       
#===========  APIs for Resume ===========
# =======================================
@app.route("/resume", methods=["POST"])
def create_resume():
    with get_session() as session: 

        data = request.json
 
        heading_info = data.get('headingInfo')
        work_exp_info = data.get('workExpInfo')
        template_info = data.get('templateInfo')
        education_info = data.get('eduInfo')
        skill_info = data.get('skillInfo')
        summary = data.get('summary')
        additional_info = data.get("additionalInfo")
        
        # JSON parsing
        heading = json.loads(heading_info)
        work_experiences = json.loads(work_exp_info)
        template_data = json.loads(template_info)
        educations = json.loads(education_info)
        skills = json.loads(skill_info)
        additional_data = json.loads(additional_info)
        
        social_media= additional_data.get("socialMediaInfo")
        languages = additional_data.get("langInfo")
 
        user_id = str( uuid.uuid4() )

        address_id = add_address(session, heading["city"], heading["country"])
        resume_id = str( uuid.uuid4())
        profile_file_name = heading.get("profile_file_name")
        if profile_file_name:
            file_path = f"images/profile/{profile_file_name}"
        else:
            file_path = ""
        resume = Resume(
            id = resume_id,
            template_id=template_data['templateId'],
            user_id=user_id,   
            username=heading["username"],
            profession=heading["profession"], 
            phone=heading.get("phone"),  
            image_file_path=file_path,
            email= heading["email"],  
            address_id=  address_id, 
            summary = summary
        )
        if social_media:
            social_media = create_social_media_instances(resume_id=resume_id,data= social_media)
            resume.social_media = social_media
        if len(languages) > 0:
            languages = create_language_instances(resume_id = resume_id, data =languages)
            resume.languages = languages
        
        resume.work_experiences  = create_work_experience_instances(resume_id= resume_id, data= work_experiences)
        resume.educations = create_education_instances(resume_id=resume_id , data=educations)
        resume.skills = create_skill_instances(resume_id, skills)
        resume.template = get_template(session=session, template_id=template_data['templateId'])
     
           
        try:         
            session.add(resume)
            session.commit()
            return jsonify({"message": "Resume created successfully!", "resume_id": resume_id}), 201

        except Exception as err:
       
            print(err)
            abort(500, description="An error occurred while processing the request")
 
    return resume, 200

 
@app.route("/profile/<string:file_name>", methods=['GET'])
def get_profile(file_name:str):
    if file_name == "":
        return  jsonify({"success": False, "message":"Invalid file type"}), 400
    
    profile_folder_path = os.environ.get("PROFILE_FILE_PATH")

    try:
        return send_from_directory(profile_folder_path, file_name)
    except FileNotFoundError:
        return jsonify({"success": False, "message": "File not found"}), 404
    
@app.route("/template/<string:template_id>", methods=["GET"])
def get_template_html(template_id):
 
    template_path = f"templates/resume-templates/{template_id}.html"
    try:
        with open(template_path, 'r') as file:
            template = file.read()
    except FileNotFoundError:
        return "Template not found", 404

    return template

 
# ========================================
# ====== APIs for file uploading =========
# ========================================

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
    
    
@app.route("/template/upload", methods=["POST"])
def upload_template():
  
    if 'template_file' not in request.files:
        return "Missing file part", 400
    
    template_file = request.files['template_file']
    
    template_folder_path = os.environ.get("TEMPLATE_FILE_PATH")    
 
    file_name, file_path = save_template_file(file=template_file, upload_folder_path=template_folder_path)
    
    # Remove the "template/" prefix as Jinja loading already handles it during file rendering
    file_path = file_path.replace("templates/", "", 1)
    if file_name is None:
        return "Invalid file type", 400
    
    with get_session() as session:
        try:
            template = Template(name=file_name, template_file_path=file_path)
            session.add(template)
            session.commit()
        
        
            return render_template("template-uploader.html", contents = {'message':"File uploaded successfully"})
        except Exception as err:
            print(err)
            return "Failed to save file to db", 500


# ====================================================
#  ========= OPENAI APIs for text generation =========
# ====================================================

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

    

# ==================================================
# ====== APIs for Rendering front-end Pages ========
# ==================================================

@app.route("/")
@app.route("/home")
def index():
    DB_FILE_PATH = os.environ.get("DB_FILE_PATH")
    if not os.path.exists(DB_FILE_PATH):
        init_db()
    return render_template("index.html")

@app.route("/resume/section/select-template")
def render_resume_template_page():
    
    with get_session() as session:
        template_instances = session.query(Template).all()
        contents = {"templates": []}
        for template in template_instances:
     
            sample_resume = get_sample_resume(template=template)
 
            
            data = {"template_id": template.id, "template_file_path": template.template_file_path, "resume": sample_resume }
       
        
            contents["templates"].append(data)
       
          
        return render_template("template-resume.html", contents=contents)


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

@app.route("/resume/section/summary",  methods=["GET"])
def render_summary_page():
    return render_template("summary-resume.html")

@app.route("/resume/section/finalize",  methods=["GET"])
def render_finalize_page():
    
    return render_template("finalize-resume.html")


@app.route("/resume/section/complete", methods=["GET"])
def render_completed_resume():
    resume_id = request.args.get('resume_id')
    if resume_id is None:
        return jsonify({"message": "Resume id must be included"}), 403
 
    with get_session() as session:
        resume:Resume = session.query(Resume).filter_by(id=resume_id).options(
            joinedload(Resume.work_experiences),
            joinedload(Resume.educations),
            joinedload(Resume.skills),
            joinedload(Resume.address),
            joinedload(Resume.template),
            joinedload(Resume.user)
        ).one()
        selected_template_path = resume.template.template_file_path
 
        return render_template('complete-resume.html', contents ={"template_path": selected_template_path , "resume":resume} )
 

@app.route("/auth/template-preview", methods=["GET"])
def render_template_preview():
    resume_id = "c64095dc-deab-4398-b44f-2f966df08d5a"
    with get_session() as session:
        # resume:Resume = session.query(Resume).filter_by(id=resume_id).options(
        #     joinedload(Resume.work_experiences),
        #     joinedload(Resume.educations),
        #     joinedload(Resume.skills),
        #     joinedload(Resume.address),
        #     joinedload(Resume.template),
        #     joinedload(Resume.user)
        # ).one()
        resume:Resume = session.query(Resume).options(
            joinedload(Resume.work_experiences),
            joinedload(Resume.educations),
            joinedload(Resume.skills),
            joinedload(Resume.address),
            joinedload(Resume.template),
            joinedload(Resume.user),
            joinedload(Resume.languages),
            joinedload(Resume.social_media)
        ).first()
        template_file_path = resume.template.template_file_path

        return render_template(template_file_path, resume=resume)


@app.route("/auth/template", methods=["GET"])
def template_page():
    return render_template("template-uploader.html")

if __name__ == "__main__":
    app.debug