import os
import openai
import uuid
from uuid import UUID
import json
from dotenv import load_dotenv
from sqlalchemy.exc import NoResultFound
from flask_sqlalchemy import SQLAlchemy
from db import get_session, init_db
from tables import Resume, WorkExperience, Education, Skill, Template, User, Address
from hashlib import md5
from utils import get_resume_from_db, save_template_file, save_profile_image, get_start_end_dates, get_all_templates
from flask import Flask, request, render_template, jsonify, send_from_directory, abort
from sqlalchemy.orm import Session

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





def add_address(session,city, country) -> uuid.UUID:
    existing_address = session.query(Address).filter_by(
    city=city,
    country=country
    ).first()

    if existing_address:
        return existing_address.id
    else:
       
        address = Address(
            city=city,
            country=country
        )
        session.add(address)
        session.commit()
        
    return address.id



def create_work_experience_instances(resume_id:uuid.UUID, data: list[dict]) -> list[WorkExperience]:
    work_experiences = []
    try:
        for work_exp in data:
            start_date, end_date = get_start_end_dates(work_exp["start_date", work_exp["end_date"]])
                    
            work_experience = WorkExperience(
                resume_id=resume_id,
                company_name=work_exp['company'],
                position=work_exp['job'],
                location=work_exp['location'],
                start_date= start_date,
                end_date=end_date,
                is_working=work_exp['isWorking'],
                summary=work_exp['achievements']
            )
            work_experiences.append(work_experience)
    except Exception as err:
        print(err)
        print("An error occurred while processing the work experience")
    return work_experiences
    

def create_education_instances(resume_id:int, data:list[dict]) -> list[Education]:
    education_instances =  []
    try:
        for edu in data:
            start_date, end_date = get_start_end_dates(edu["start_date", edu["end_date"]])
            education = Education(
                resume_id=resume_id,
                name=edu['school'],
                location=edu['location'],
                degree=edu['degree'],
                start_date=start_date,
                end_date= end_date,
                is_graduate=edu['is_working']
            )
            education_instances.append(education)
    except Exception as err:
       
            print(err)
            print("An error occurred while processing the education")
    return education_instances


def create_skill_instances(resume_id:int, data:list[dict]) -> list[Skill]:
    skills = []
    try:
        for skill in data:
            skill_instance = Skill(
                resume_id=resume_id,
                name=skill['skill'],
                # Converting to the enum name
                proficiency=skill['expertiseLevel'].upper()  
            )
            skills.append(skill_instance)
    except Exception as err:
                
            print(err)
            print("Error ocucrred in skill")
            
    return skills

def get_template(session: Session, template_id: str) -> Template:
    try:
    
 

        result = session.query(Template).filter_by(id=template_id).one()
        return result

    except Exception as err:
        print(err)
        print(f"Failed to retrieve the template {template_id}")
        
        
# =======================================       
#=========== Resume APIs ================
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
         
        heading = json.loads(heading_info)
        work_experiences = json.loads(work_exp_info)
        template_data = json.loads(template_info)
        educations = json.loads(education_info)
        skills = json.loads(skill_info)
        
        user_id = str( uuid.uuid4() )

        address_id = add_address(session, heading["city"], heading["country"])
     
        resume = Resume(
            
            template_id=template_data['templateId'],
            user_id=user_id,   
            username=heading["username"],
            profession=heading["username"], 
            phone=heading.get("phone"),  
            email= heading["email"],  
            address_id=  address_id  
        )
        
        resume_id = resume.id
        resume.work_experiences  = create_work_experience_instances(resume_id= resume_id, data= work_experiences)
        resume.educations = create_education_instances(resume_id=resume_id , data=educations)
        resume.skills = create_skill_instances(resume_id, skills)
        resume.template = get_template(session=session, template_id=template_data['templateId'])
     
           
        try:         
      
            session.add(resume)
            session.commit()
        
            return jsonify({"message": "Resume created successfully!", "resume_id": str(resume_id)}), 201

        except Exception as err:
       
            print(err)
            abort(500, description="An error occurred while processing the request")
 
    return resume, 200


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
        template = Template(name=file_name, template_file_path=file_path)
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

    

# =============================================
#  Render Page APIs for Resume section pages 
# =============================================


@app.route("/resume/select-template")
def render_resume_template_page():
    
    
    with get_session() as session:
        template_instances = session.query(Template).all()

        templates_svg_files ={}
        for template in template_instances:
            print(template.id)
        templates_svg_files[template.id] = 'static/images/resume/template3.svg'
  
        contents = {"template_svg_files": [], "other_data": "example_value"}
        
        for key, file_path in templates_svg_files.items():
            with open(file_path, 'r') as file:
                svg_file = {key: file.read()}
                contents["template_svg_files"].append(svg_file)
          
        return render_template("resume.html", contents=contents)


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




@app.route("/auth/template", methods=["GET"])
def template_page():
    return render_template("template-uploader.html")

if __name__ == "__main__":
    app.debug