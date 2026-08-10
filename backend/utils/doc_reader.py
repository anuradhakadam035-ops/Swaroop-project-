from docx import Document

def extract_doc_text(file_path):

    document = Document(file_path)

    text = ""

    for para in document.paragraphs:

        text += para.text + "\n"

    return text