import uuid
from typing import Optional
from tables import Address, WorkExperience, Skill, Education, SocialMedia, Language

class Resume:
    id: uuid.UUID
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
    

    def __init__(
        self,
        username: str,
        profession: str,
        phone: str,
        email: str,
        summary: str,
        image_file_path: Optional[str] = "",
        work_experiences: list["WorkExperience"]  = [],
        skills: list["Skill"] = [],
        educations: list["Education"] = [],
        address: Optional[list["Address"]] = [],
        language: Optional[list["Language"]] = [],
        social_media: Optional[list["SocialMedia"]] = [],
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