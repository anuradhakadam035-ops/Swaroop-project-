from fastapi import APIRouter

router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"]
)

@router.get("/{career}")
def get_jobs(career:str):

    return [

        {

            "title":"AI Engineer",

            "company":"Google",

            "salary":"10-18 LPA",

            "experience":"0-2 Years",

            "location":"Bangalore",

            "skills":[

                "Python",

                "TensorFlow",

                "SQL"

            ],

            "link":"https://careers.google.com"

        },

        {

            "title":"Machine Learning Engineer",

            "company":"Microsoft",

            "salary":"9-16 LPA",

            "experience":"0-2 Years",

            "location":"Hyderabad",

            "skills":[

                "Python",

                "ML",

                "Scikit Learn"

            ],

            "link":"https://careers.microsoft.com"

        },

        {

            "title":"Data Scientist",

            "company":"Amazon",

            "salary":"12-20 LPA",

            "experience":"1 Year",

            "location":"Pune",

            "skills":[

                "Python",

                "SQL",

                "Statistics"

            ],

            "link":"https://amazon.jobs"

        }

    ]