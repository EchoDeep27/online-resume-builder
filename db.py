"""
Adopted from https://flask.palletsprojects.com/en/3.0.x/patterns/sqlalchemy/
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base

load_dotenv()
DB_URI = os.environ.get("DB_URI")
engine = create_engine(DB_URI, echo=True)

db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)
Base = declarative_base()
Base.query = db_session.query_property()


def init_db():

    import models

    Base.metadata.create_all(bind=engine)
