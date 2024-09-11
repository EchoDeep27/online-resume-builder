import re
import uuid
from db import get_session

from typing import Optional, Tuple
from datetime import datetime, date
from tables import (
    User,
    Skill, 
    Resume,
    Address, 
    Template, 
    Language, 
    Education, 
    SocialMedia,
    WorkExperience, 
    SocialMediaPlatform,
    Proficiency
)
from models import Resume as ResumeModel
from flask import abort, Response
from sqlalchemy.orm import Session


def replace_newlines(text):
    formatted_text = re.sub(r'\n(.)', r'</li><li>\1', text)
    return f"<li>{formatted_text}</li>"


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


def get_template(session: Session, template_id: str) -> Template:
    
    try:
        result = session.query(Template).filter_by(id=template_id).one()
        return result

    except Exception as err:
        print(err)
        error_mesg =f"Failed to retrieve the template {template_id}"
        abort(Response(error_mesg, 505))
        
        
def create_work_experience_instances(resume_id:uuid.UUID, data: list[dict]) -> list[WorkExperience]:
    work_experiences = []
    try:
        for work_exp in data:
            start_date = work_exp.get("start_date")
            end_date = work_exp.get("end_date")
            start_date, end_date = get_start_end_dates(work_exp["start_date"], work_exp["end_date"])
            work_experience = WorkExperience(
                resume_id=resume_id,
                company_name=work_exp['company'],
                position=work_exp['job'],
                location=work_exp['location'],
                start_date= start_date,
                end_date=end_date,
                is_working=work_exp['isWorking'],
                achievement=work_exp['achievements']
            )
            work_experiences.append(work_experience)
        return work_experiences
    except Exception as err:
        print(err)
        error_mesg = "An error occurred while processing the work experience"
        abort(Response(error_mesg, 505))
    

def create_education_instances(resume_id:int, data:list[dict]) -> list[Education]:
    education_instances =  []
    try:
        for edu in data:
            start_date, end_date = get_start_end_dates(edu["start_date"], edu["end_date"])
            education = Education(
                resume_id=resume_id,
                name=edu['school'],
                location=edu['location'],
                degree=edu['degree'],
                start_date=start_date,
                end_date= end_date,
                is_studying=edu['is_studying']
            )
            education_instances.append(education)
        return education_instances
    except Exception as err:
        print(err)
        error_mesg = "An error occurred while processing the education"
        abort(Response(error_mesg, 505))
    


def create_skill_instances(resume_id:int, data:list[dict]) -> list[Skill]:
    skills = []
    try:
        for skill in data:
            skill_instance = Skill(
                resume_id=resume_id,
                name=skill['skill'],
                # Converting to the enum name
                proficiency=Proficiency[skill['expertiseLevel'].upper()]
            )
            skills.append(skill_instance)
        return skills
    except Exception as err:
                
        print(err)
        error_mesg = "Error ocucrred in skill"
        abort(Response(error_mesg, 505))

def create_social_media_instances(resume_id: str, data: dict) -> list[SocialMedia]:
    social_media = []
 
    for name, value in data.items():
        if len(value) > 0:
            try:
                platform = SocialMediaPlatform[name.upper()]  
            except KeyError:

                print(f"Warning: '{name}' is not a valid social media platform. Skipping...")
                continue
            
 
            social_media_instance = SocialMedia(name=platform, link=value, resume_id=resume_id)
            social_media.append(social_media_instance)
    
    return social_media


def create_language_instances(resume_id:str, data:list[dict]) -> list[Language]:
    languages = []
    for item in data:
        name = item.get("language")
        fluent_level = item.get("fluentLevel")
        language_instance = Language(name=name, fluent_level= fluent_level, resume_id = resume_id)
        languages.append(language_instance)
    return languages

def get_sample_resume(template:Template):
    sample_resume = ResumeModel(
    username = "Hein Min Min Maw",
    profession = "Full-stack Developer",
    phone = "09-77943 5552",
    email= "heinmin2maw.it@gmail.com",
    summary= """ 
    A passionate full-stack developer who are actively working on software engineering environemtn.
    With 2+ years of experience in designing, developing, and maintaining web applications and services, I am proficient in Python, JS, and SQLAlchemy, with a strong foundation in front-end technologies and backend APIs, I have worked on various projects.
    """,
    image_file_path = "images/profile/sample_user.jpeg",
    address= "Taunggyi Myanmar",
    template = template
        
    ) 
    social_media_info = {
        "instagram":"www.instagram.com/hein-min-min-maw",
        "linkedIn":"www.linkedin.com/hein-min-min-maw",
        "gitHub":"https://github.com/HM3IT",
        "facebook":"https://www.facebook.com/hein-min-min-maw",
        "portfolio":"https://hm3it.github.io/"}
    
    lang_info =[
        {"language":"English","fluentLevel":"B2"},
        {"language":"Chinese","fluentLevel":"HSK-4"}
    ]
    eduI_info = [
        {"degree":"Bachelor of Software Engineering","school":"Info Myanmar University","location":"Yangon","start_date":"2020-08-20","end_date":"","is_studying":True}
    ]
    skill_info = [
        {"skill":"Python Programming","expertiseLevel":"Intermediate"},
        {"skill":"API integration","expertiseLevel":"Proficient"},
        {"skill":"AWS boto3, sqs, sns and dynamo","expertiseLevel":"Intermediate"}
    ]
    work_exp_info = [
        {
            "job":"Full Stack Developer",
            "company":"Hexcode Technologies",
            "location":"Thailand",
            "start_date":"2023-11-27",
            "end_date":"",
            "achievements":"Handle the back-end of an AI powered website 'fedfunl.com' that has crawler and generate post using chatgpt 4.0 engine.\nIntegrated AWS services, backend API framework like litestar, AWS chalice",
            "isWorking":True
        },
        {
            "job":"Operation Assistant",
            "company":"Carrerconyat",
            "location":"Yangon",
            "start_date":"2024-08-30",
            "end_date":"",
            "achievements":"Work with multiple department including marketing team, business development team and customer service team to perform daily tasks.\n",
            "isWorking":False}
        ]
    sample_resume.work_experiences  = create_work_experience_instances(sample_resume.id, work_exp_info)
    sample_resume.educations  = create_education_instances(sample_resume.id, eduI_info)
    sample_resume.social_media  = create_social_media_instances(sample_resume.id,social_media_info)
    sample_resume.skills = create_skill_instances(sample_resume.id, skill_info)
    sample_resume.languages = create_language_instances(sample_resume.id, lang_info)
    return sample_resume

 

def get_all_templates():
   with get_session() as session:
        return session.query(Template).all()



def allowed_file_type(filename: str, extensions: list) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in extensions

def save_template_file(file, upload_folder_path: str) -> Tuple[Optional[str], Optional[str]]:
    if file and allowed_file_type(file.filename, ["html"]): 
        return _save_file(file, upload_folder_path)
    return None, None

def save_profile_image(file, upload_folder_path: str) -> Tuple[Optional[str], Optional[str]]:
    if file and allowed_file_type(file.filename, ["png", "jpeg", "jpg"]): 
        return _save_file(file, upload_folder_path)
    return None, None

def _save_file(file, upload_folder_path: str,  custom_extension: Optional[str] = None) -> Tuple[str, str]:
    file_id = uuid.uuid4()
    file_name, file_extension = file.filename.rsplit('.', 1)

    file_name = f"{file_name}-{file_id}.{custom_extension or file_extension}"
    file_path = f"{upload_folder_path}/{file_name}"
    file.save(file_path)
    return file_name, file_path



def convert_to_date(date_str: str) -> Optional[date]:
    return datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None


def get_start_end_dates(start_date: str, end_date: str) -> Tuple[date, Optional[date]]:
    start_date = convert_to_date(start_date)
    if len(end_date) == 0:
        end_date = None
    else:
        end_date = convert_to_date(end_date)
    return start_date, end_date