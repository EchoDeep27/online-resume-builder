import uuid
from typing import Optional
from tables import Address, WorkExperience, Skill, Education, SocialMedia, Language, Template

class Resume:
    id: str
    username: str
    profession: str
    phone: str
    email: str
    summary: str
    image_file_path: Optional[str]
    address: Optional["Address"]= []
    work_experiences: list["WorkExperience"]= []
    skills: list["Skill"]= []
    educations: list["Education"]= []
    language:list["Language"] = []
    social_media:list["SocialMedia"] = []
    template: Template
    template_theme: str
    

    def __init__(
        self,
        username: str,
        profession: str,
        phone: str,
        email: str,
        summary: str,
        template: Template,
        image_file_path: Optional[str] = "",
        work_experiences: list["WorkExperience"]  = [],
        skills: list["Skill"] = [],
        educations: list["Education"] = [],
        address: Optional[list["Address"]] = [],
        language: Optional[list["Language"]] = [],
        social_media: Optional[list["SocialMedia"]] = [],
        template_theme:Optional[str] = "#00026e"
    ):
        self.id = uuid.uuid4()
        self.username = username
        self.profession = profession
        self.phone = phone
        self.email = email
        self.image_file_path = image_file_path
        self.address = address
        self.work_experiences = work_experiences
        self.skills = skills
        self.educations = educations
        self.social_media = social_media
        self.language =  language
        self.summary = summary
        self.template = template
        self.id = str(uuid.uuid4())
        self.template_theme = template_theme