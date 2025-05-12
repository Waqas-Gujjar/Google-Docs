from ninja import Schema , Field
import uuid

class DocSchema(Schema):
    id : uuid.UUID
    title : str
    content : str | None = Field(default="")

class DocUpdateSchema(Schema):
    title : str
    content : str

class DocCreateSchema(Schema):
    title : str
    