from ninja import Schema
import uuid

class DocSchema(Schema):
    id : uuid.UUID
    title : str
    content : str