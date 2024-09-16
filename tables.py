from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, Boolean, Date, ForeignKey, UniqueConstraint, Text
from typing import List
from db import Base
import uuid
from sqlalchemy import Enum
from enum import Enum as PyEnum
from sqlalchemy import DateTime
from datetime import datetime

class Proficiency(PyEnum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    PROFICIENT = "Proficient"
    EXPERT = "Expert"


class SocialMediaPlatform(PyEnum):
    LINKEDIN = "LinkedIn"
    FACEBOOK = "Facebook"
    INSTAGRAM = "Instagram"
    GITHUB = "GitHub"
    PORTFOLIO = "Portfolio"


class WorkExperience(Base):
    __tablename__ = "work_experience"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id: Mapped[int] = mapped_column(ForeignKey("resume.id"))
    company_name: Mapped[str] = mapped_column(String(40), nullable=False)
    position: Mapped[str] = mapped_column(String(40), nullable=False)
    location: Mapped[str] = mapped_column(String(150))
    start_date: Mapped[Date] = mapped_column(Date)
    end_date: Mapped[Date] = mapped_column(Date, nullable=True)
    is_working: Mapped[bool] = mapped_column(Boolean)
    achievement: Mapped[str] = mapped_column(nullable=True)

    resume: Mapped["Resume"] = relationship(back_populates="work_experiences")


class Education(Base):
    __tablename__ = "education"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    location: Mapped[str] = mapped_column(String(150))
    resume_id: Mapped[int] = mapped_column(ForeignKey("resume.id"))
    degree: Mapped[str] = mapped_column(String(40), nullable=False)
    start_date: Mapped[Date] = mapped_column(Date)
    end_date: Mapped[Date] = mapped_column(Date, nullable=True)
    is_studying: Mapped[bool] = mapped_column(Boolean)

    resume: Mapped["Resume"] = relationship(back_populates="educations")


class Skill(Base):
    __tablename__ = "skill"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id: Mapped[int] = mapped_column(ForeignKey("resume.id"))
    name: Mapped[str] = mapped_column(String(30))
    proficiency: Mapped[Proficiency] = mapped_column(
        Enum(Proficiency, name="proficiency_enum")
    )

    resume: Mapped["Resume"] = relationship(back_populates="skills")


class Address(Base):
    __tablename__ = "address"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    city: Mapped[str] = mapped_column(String(40), nullable=False)
    country: Mapped[str] = mapped_column(String(40), nullable=False)

    # To ensure no duplicate addresses data
    __table_args__ = (UniqueConstraint("city", "country", name="unique_city_country"),)

    resumes: Mapped[List["Resume"]] = relationship(back_populates="address")


class SocialMedia(Base):
    __tablename__ = "social_media"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id: Mapped[int] = mapped_column(ForeignKey("resume.id"))
    name: Mapped[SocialMediaPlatform] = mapped_column(
        Enum(SocialMediaPlatform, name="social_media_enum")
    )
    link: Mapped[str] = mapped_column(String(100), nullable=False)
    resume: Mapped["Resume"] = relationship(back_populates="social_media")


class Language(Base):
    __tablename__ = "language"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    resume_id: Mapped[int] = mapped_column(ForeignKey("resume.id"))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    fluent_level: Mapped[str] = mapped_column(String(100), nullable=False)
    resume: Mapped["Resume"] = relationship(back_populates="languages")


class Resume(Base):
    __tablename__ = "resume"
    id: Mapped[str] = mapped_column(primary_key=True)
    template_id: Mapped[int] = mapped_column(ForeignKey("template.id"))
    address_id: Mapped[int] = mapped_column(ForeignKey("address.id"))
    is_headshot: Mapped[bool] = mapped_column(Boolean)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    username: Mapped[str] = mapped_column(String(40), nullable=False)
    profession: Mapped[str] = mapped_column(String(40), nullable=False)
    image_file_path: Mapped[str] = mapped_column(String(150), nullable=True)
    phone: Mapped[str] = mapped_column(String(40), nullable=False)
    email: Mapped[str] = mapped_column(String(40), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    template_theme: Mapped[str] = mapped_column(String(50), nullable=False)
    address: Mapped["Address"] = relationship(back_populates="resumes")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    social_media: Mapped[List[SocialMedia]] = relationship(
        back_populates="resume", cascade="all, delete-orphan"
    )
    languages: Mapped[List[Language]] = relationship(
        back_populates="resume", cascade="all, delete-orphan"
    )

    work_experiences: Mapped[List[WorkExperience]] = relationship(
        back_populates="resume", cascade="all, delete-orphan"
    )
    educations: Mapped[List[Education]] = relationship(
        back_populates="resume", cascade="all, delete-orphan"
    )
    skills: Mapped[List[Skill]] = relationship(
        back_populates="resume", cascade="all, delete-orphan"
    )
    template: Mapped["Template"] = relationship("Template", back_populates="resumes")
    user: Mapped["User"] = relationship(back_populates="resumes")


class Template(Base):
    __tablename__ = "template"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(40), nullable=False)
    template_file_path: Mapped[str] = mapped_column(String(150), nullable=False)
    resumes: Mapped[List["Resume"]] = relationship(back_populates="template")


class User(Base):
    __tablename__ = "users"
    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(30), nullable=False)
    email: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(String(250), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    is_authenticated: Mapped[bool] = mapped_column(Boolean, default=True)

    resumes: Mapped[List["Resume"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )

    def __init__(
        self, name: str, email: str, password: str = None, is_active: bool = True, **kwargs
    ):
        super().__init__(**kwargs)
        self.name = name
        self.email = email
        self.password = password
        self.is_active = is_active

    def __repr__(self) -> str:
        return f"User(id={self.id}), name={self.name}, email={self.email}, is_active={self.is_active})"

    def get_id(self):
        return self.id
