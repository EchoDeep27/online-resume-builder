import uuid
from db import get_session

from typing import Optional, Tuple
from datetime import datetime, date
from tables import Template
from models import Resume



def get_sample_resume(template_id:str):
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
    address= "Taunggyi Myanmar"
        
    ) 
    sample_resume.work_experiences  = create_work_experience_instances()
    sample_resume.educations  = create_education_instances()
    sample_resume.social_media  = create_social_media_instances()
    return sample_resume

def get_template(template_id: str) -> Template:
    template = None
    with get_session() as session:
        template = (
            session.query(Template)
            .filter(Template.id == template_id)
            .first()
        )
        
    return template

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