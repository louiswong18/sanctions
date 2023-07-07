import pdfplumber
import json
import re

def extract_questions(pdf_path):
    questions = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text().strip()
            lines = text.split('\n')

            for line in lines:
                if re.match(r'\d+\.', line):
                    question_number, question_text = re.split(r'\s+', line, 1)
                    questions.append({
                        "number": question_number.rstrip('.'),
                        "text": question_text.strip()
                    })

    return questions

if __name__ == "__main__":
    pdf_path = "7126-due-diligence-and-sanctions-questionnaire-cbl-cbf-data.pdf"
    questions = extract_questions(pdf_path)

with open("questions.json", "w", encoding="utf-8", errors="ignore") as outfile:
    json.dump(questions, outfile, ensure_ascii=False, indent=4)