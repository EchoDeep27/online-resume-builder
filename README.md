# README #

## Overview
The Online Resume Builder is an innovative web application designed to streamline the resume creation process using advanced AI technologies. This project leverages powerful text generation models and user-friendly interfaces to help users craft professional resumes effortlessly.

## Key Features
AI-Powered Text Generation: Initially utilizing the `ChatGPT 3.5 Turbo` model, the application has transitioned to the more reliable Cohere API for generating high-quality text. With a generous free trial offering, Cohere enables users to create compelling resume content efficiently.

Third-Party Google Login: The integration of `OAuth 2.0` allows users to sign in or create accounts seamlessly using their Google credentials, enhancing user experience during account setup.

## Limitation
The current version of the website is only usable for desktop users. Other devices, such as phones and tablets, have limited functionality and are not yet optimized.


## Development Challenges & Achievements
The project faced several challenges, including API reliability and PDF download quality, which were addressed through strategic implementation of third-party libraries like jsPDF and a focus on user-centered design. Through these experiences, valuable insights were gained regarding API integration, data handling, and user authentication.




## Setup
To setup the proejct, please run the following command to build a virtual environment to install dependencies.

```bash
# myenv is the name of the venv
cp env.example .env

python -m venv myenv

# For window
myenv\Scripts\activate

# for linux
source myenv/bin/activate
```

After then run this command.

```bash

pip install -r requirements.txt
```

After installing the dependencies, generate an API key from [Cohere](https://dashboard.cohere.com/api-keys) and add it to the `.env` file.

Similarly, a Google Client ID and secret key are required to enable the Google third-party login option. You can generate them from [Google Cloud Console]((https://console.cloud.google.com)).

Once you have completed the steps above, use the following command to start the program:


```bash
# for developer mode
flask run --debug
```


### References ###

* Writing tests
* Code review
* Other guidelines
