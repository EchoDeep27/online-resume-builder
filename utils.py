import uuid
from db import get_session

from typing import Optional, Tuple

from tables import WorkExperience, Skill, Education, Template
from models import Resume

def get_resume_from_db(resume_id: int) -> Resume:
    pass
    with get_session() as session:
        resume = (
            session.query(Resume)
            .filter(Resume.id == resume_id)
            .first()   
        )
        return resume
    
def get_template(template_id: str) -> Template:
    with get_session() as session:
        template = (
            session.query(Template)
            .filter(Template.id == template_id)
            .first()
        )
        
        return template

def allowed_file(filename: str, extensions: list) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in extensions

def save_template_file(file, upload_folder_path: str) -> Tuple[Optional[str], Optional[str]]:
    if file and allowed_file(file.filename, ["html"]): 
        return _save_file(file, upload_folder_path, "html")
    return None, None

def save_profile_image(file, upload_folder_path: str) -> Tuple[Optional[str], Optional[str]]:
    if file and allowed_file(file.filename, ["png", "jpeg", "jpg"]): 
        return _save_file(file, upload_folder_path, file.filename.rsplit('.', 1)[1].lower())
    return None, None

def _save_file(file, upload_folder_path: str, file_extension: Optional[str] = None) -> Tuple[str, str]:
    file_id = uuid.uuid4()
    file_name = f"{file_id}.{file_extension or file.filename.rsplit('.', 1)[1].lower()}"
    file_path = f"{upload_folder_path}/{file_name}"
    file.save(file_path)
    return file_name, file_path