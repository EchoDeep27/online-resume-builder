"""
Adopted from https://flask.palletsprojects.com/en/3.0.x/patterns/sqlalchemy/
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker, declarative_base
from contextlib import contextmanager

# Load environment variables from .env file
load_dotenv()
DB_URI = os.environ.get("DB_URI")
engine = create_engine(DB_URI, echo=True)


Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db_session = scoped_session(Session)

Base = declarative_base()
Base.query = db_session.query_property()

@contextmanager
def get_session(scope_func=None):
    """Provide a transactional scope around a series of operations."""
    session = scoped_session(Session, scopefunc=scope_func)
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.remove()

def init_db():
    """Setup the database by creating tables."""
    import tables 
    Base.metadata.create_all(bind=engine)

