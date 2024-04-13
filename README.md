## Interview.AI


This repository contains the source code and resources for the Tech-Enhanced AI Interview Learning Platform, a sophisticated machine learning model designed to generate diverse interview questions, analyze spoken responses, and provide feedback on speaking pace, grammatical correctness, and emotional tone.
This is the submission for TechShilla.

## Features

- **Question Generation:** Utilizes a fine-tuned version of the Mistral model to generate relevant interview questions and ideal answers.
- **Speech Recognition:** Employs a fine-tuned version of the Whisper model for accurate speech-to-text conversion.
- **Emotion Detection:** Uses an LSTM-based model for real-time speech emotion recognition to assess and provide feedback on the emotional tone of the speaker.

## Getting Started

### Prerequisites

- PyTorch 1.8.1+
- NumPy
- librosa
- pydub
- Node.JS v18
- Python 3.10

### Installation

Clone the repository and install the required packages:

```bash
git clone https://github.com/your-github-username/interview-ai.git
cd interview-ai
pip install -r requirements.txt

