from pydantic import BaseModel
from typing import List


class JobCreate(BaseModel):

    title: str

    company: str

    location: str

    experience: str

    salary: str

    skills: List[str]

    link: str

    career: str

    job_type: str = "Full Time"

    work_mode: str = "Hybrid"


class JobResponse(BaseModel):

    id: int

    title: str

    company: str

    location: str

    experience: str

    salary: str

    skills: List[str]

    link: str

    career: str

    job_type: str

    work_mode: str

    class Config:

        from_attributes = True