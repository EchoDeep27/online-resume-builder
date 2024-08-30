from sqlalchemy.orm import Session
from uuid import UUID
from tables import Template
from db import get_session

def get_template(session: Session, template_id: str) -> Template:
    try:
        # Convert string to UUID if necessary
        template_id = UUID(template_id) if isinstance(template_id, str) else template_id
        print("Template ID:", template_id)

        result = session.query(Template).filter_by(id=template_id).one()
        return result

    except Exception as err:
        print(err)
        print(f"Failed to retrieve the template {template_id}")

# Example usage
with get_session() as session:
    template_id = '1a93cb3a-0df5-4ab1-8c2a-1710b2535387'
    template = get_template(session, template_id)
    print(template)
