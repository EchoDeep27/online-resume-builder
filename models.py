import uuid
from typing import Optional, List
from tables import Address, WorkExperience, Skill, Education

class Resume:
    id: uuid.UUID
    username: str
    profession: str
    phone: str
    email: str
    image_file_path: Optional[str]
    address_id: Optional[uuid.UUID]
    address: Optional["Address"]
    work_experiences: List["WorkExperience"]
    skills: List["Skill"]
    educations: List["Education"]

    def __init__(
        self,
        username: str,
        profession: str,
        phone: str,
        email: str,
        work_experiences: List["WorkExperience"] = [],
        skills: List["Skill"] = [],
        educations: List["Education"] = [],
        image_file_path: Optional[str] = None,
        address_id: Optional[uuid.UUID] = None,
        address: Optional["Address"] = None,
    ):
        self.id = uuid.uuid4()
        self.username = username
        self.profession = profession
        self.phone = phone
        self.email = email
        self.image_file_path = image_file_path
        self.address_id = address_id
        self.address = address
        self.work_experiences = work_experiences
        self.skills = skills
        self.educations = educations