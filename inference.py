import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, LlamaForCausalLM

model_id = "mistralai/Mistral-7B-Instruct-v0.2"
tokenizer = AutoTokenizer.from_pretrained("./finetuned-mixtral")

# load in 8bit
model = AutoModelForCausalLM.from_pretrained(
    model_id, 
    load_in_8bit=True,
    device_map='auto',
)

#### Code for the loading of the tensor of the models
category = "Machine Learning"
## From pretrained
prompt_1 = "You are an experienced interviewer in the field of Machince Learning. Generate 5 questions in increasing difficulty to gauge the depth of knowlege of interviewee. (seperated by {})"
## Pass the prompt to get the response
inputs = tokenizer(prompt_1, return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=200)

print(tokenizer.decode(outputs[0], skip_special_tokens=True))


