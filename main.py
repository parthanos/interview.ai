# import flast module
from flask import Flask, jsonify, request
from transformers import AutoModelForCausalLM, AutoTokenizer, LlamaForCausalLM
import torch
import json

model_id = "mistralai/Mistral-7B-Instruct-v0.2"
model_finetuned_path = ""
tokenizer = AutoTokenizer.from_pretrained(model_finetuned_path)

# load in 8bit
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    load_in_4bit=True,
    device_map="auto",
)

# instance of flask application
app = Flask(__name__)


def generate_question_prompt(category: str):

    prompt = f"""<s>
    [INST] You are an experienced interviewer in the field of [{category}]. Generate 10 questions to gauge the depth of knowlege of interviewee.
    [/INST]

    </s>""".strip()

    return prompt


def generate_answer_prompt(category, question, answer):
    prompt = f"""<s>
    [INST] You are an interviewee in the field of [{category}]. Answer the following question [{question}] in the best way possible,
    and analyse this answer [{answer}] and give tips and mention grammatical errors, take care to give generic feedback without mention of projects.
    [/INST]
    </s>""".strip()

    return prompt


def get_cleaned_questions(ques_string: str):
    ques_list = ques_string.split("\n")[1:]
    questions = []
    for ques in ques_list[3:]:
        question_1 = ques.strip()
        if question_1.strip() != "" and len(questions) < 5:
            if question_1[0] == "m":
                question_1 = question_1[1:]
            questions.append(question_1)

    return questions


def get_model_response(input_prompt: str):
    inputs = tokenizer(input_prompt, return_tensors="pt").to("cuda")
    outputs = model.generate(**inputs, max_new_tokens=400)
    _questions = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return _questions


def clean_answer_response(res):
    return res.split("[/INST]\n")[1]


# home route that returns below text when root url is accessed
@app.route("/questions/<category>")
# home route that returns below text when root url is accessed
def get_questions_json(category):
    ## From pretrained
    print(category)
    prompt = generate_question_prompt(category)
    _questions = get_model_response(prompt)
    questions = get_cleaned_questions(_questions)

    # Format the questions into a JSON structure
    json_data = json.dumps({"questions": questions})
    # print(json_data)
    # Return JSON response
    return json_data


# Endpoint to receive the question and return the model's response
@app.route("/answer_analysis", methods=["POST"])
def get_answer_analysis():
    data_array = request.get_json()
    responses = []
    for data in data_array:
        question = data["question"]
        category = data["category"]
        answer = data["answer"]
        prompt = generate_answer_prompt(category, question, answer)
        # Get the response from the language model
        model_response = get_model_response(prompt)
        responses.append(clean_answer_response(model_response))

    # Return the response as JSON
    return jsonify({"response": responses})


if __name__ == "__main__":
    app.run(debug=True)
