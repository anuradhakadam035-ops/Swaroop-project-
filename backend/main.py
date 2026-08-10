from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# ============================================================
# DATABASE
# ============================================================

from database import Base, engine

# ============================================================
# MODELS
# Import models BEFORE create_all
# ============================================================

from models.user import User
from models.admin import Admin
from models.resume import Resume
from models.student_answer import StudentAnswer
from models.assessment_question import AssessmentQuestion
from models.assessment_result import Assessment

# ============================================================
# ROUTERS
# ============================================================

from routers import auth
from routers import chatbot
from routers import assessment
from routers import analytics
from routers import ai
from routers import resume
from routers import admin
from routers import recommendation
from routers import interview
from routers import report
from routers import dashboard
from routers import profile
from routers import roadmap
from routers import jobs
from routers import admin_course
from models.admin_course import Course
from routers import admin_jobs
from routers import admin_dashboard
from routers import admin_students
from routers import admin_questions

# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI Career Guidance System",
    description="AI Powered Career Recommendation Platform",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",

    "http://127.0.0.1:3000",
    "http://localhost:3000",

     # Add Vercel URL after frontend deployment
    # "https://your-project.vercel.app",
]


from fastapi.middleware.cors import CORSMiddleware


origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,

    allow_origins=origins,

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# ============================================================
# STATIC FILES
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)


# ============================================================
# NORMAL USER ROUTERS
# ============================================================

app.include_router(auth.router)

app.include_router(assessment.router)

app.include_router(dashboard.router)

app.include_router(ai.router)

app.include_router(resume.router)

app.include_router(recommendation.router)

app.include_router(interview.router)

app.include_router(report.router)

app.include_router(profile.router)

app.include_router(analytics.router)

app.include_router(roadmap.router)

app.include_router(jobs.router)

app.include_router(admin_course.router)

app.include_router(chatbot.router)




# ============================================================
# ADMIN ROUTERS
# ============================================================

app.include_router(admin.router)

app.include_router(admin_dashboard.router)

app.include_router(admin_students.router)

app.include_router(admin_jobs.router)

app.include_router(admin_questions.router)

# ============================================================
# ROOT API
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Welcome to AI Career Guidance System 🚀",
        "status": "Running Successfully",
        "version": "1.0.0"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health():

    return {
        "server": "Running",
        "database": "Connected",
        "api": "Healthy"
    }