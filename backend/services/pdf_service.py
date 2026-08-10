import os
import pdfplumber
from docx import Document


def extract_text(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    text = ""

    if extension == ".pdf":

        with pdfplumber.open(file_path) as pdf:

            for page in pdf.pages:

                page_text = page.extract_text()

                if page_text:

                    text += page_text + "\n"

    elif extension == ".docx":

        doc = Document(file_path)

        for para in doc.paragraphs:

            text += para.text + "\n"

    return text