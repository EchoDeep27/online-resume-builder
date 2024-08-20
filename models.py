from sqlalchemy.orm import mapped_column, Mapped, relationship
from sqlalchemy import String, ForeignKey
from typing import List
from enum import Enum
from db import Base
from sqlalchemy.dialects.postgresql import ENUM


proficiency_enum = ENUM(
    "Professional",
    "Decent",
    "Intermediate",
    "Beginner",
    name="proficiency",
    create_type=False,
)


class Proficiency(Enum):
    PROFESSION = "Professional"
    DECENT = "Decent"
    INTERMEDIATE = "Intermediate"
    BEGINNER = "BEGINNER"


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(100))
    password: Mapped[str] = mapped_column(String(250))

    def __init__(self, name: str, email: str, password: str, **kwargs):
        super().__init__(**kwargs)
        self.name = name
        self.email = email
        self.password = password

    def __repr__(self) -> str:
        return f"User(id={self.id}), name={self.name}, email={self.email})"


class WorkExperience(Base):
    __tablename__ = "work_experience"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    company_name: Mapped[str] = mapped_column(String(40))
    position: Mapped[str] = mapped_column(String(40))
    start_date: Mapped[str] = mapped_column(String(40))
    end_date: Mapped[str] = mapped_column(String(40))


class Education(Base):
    __tablename__ = "education"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    degree: Mapped[str] = mapped_column(String(30))
    achieved_date: Mapped[str] = mapped_column(String(40))


class Skill(Base):
    __tablename__ = "skill"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    name: Mapped[str] = mapped_column(String(30))
    proficiency: Mapped[Proficiency] = mapped_column(proficiency_enum)


# class Resume(Base):
#     __tablename__ = "resume"
#     id: Mapped[int] = mapped_column(primary_key=True)
#     user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
#     work_experiences: Mapped[List[WorkExperience]] = relationship(
#         back_populates="users", cascade="all, delete-orphan"
#     )
