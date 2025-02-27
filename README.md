# Integry-Langchain-Bot

## Overview
This repository contains a full-stack application with a **Next.js** frontend and a **Flask** backend. Follow the steps below to set up and run the project locally.

---

## Folder Structure
```
📦 project-root
 ┣ 📂 frontend   # Next.js Frontend
 ┣ 📂 backend    # Flask Backend
 ┣ 📜 README.md  # Documentation
```

---

## Frontend Setup
### Prerequisites
- Node.js installed
- npm installed

### Installation & Running
Navigate to the `frontend` directory and run:
```sh
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000` by default.

---

## Backend Setup
### Prerequisites
- Python installed with the version greater than 12

- Virtual environment (recommended)

### Installation & Running
Navigate to the `backend` directory and set up a virtual environment:
```sh
cd backend
python -m venv venv  # Create a virtual environment
source venv/bin/activate  # Activate virtual environment (Mac/Linux)
venv\Scripts\activate  # Activate virtual environment (Windows)
```
Install dependencies:
```sh
pip install integry langchain langgraph langchain_openai
```
Create a `.env` file in the `backend` directory and add your OpenAI API key and port:
```
OPENAI_API_KEY=sk-proj-xx
PORT=5000
```
Run the backend server:
```sh
python app.py
```
The backend will run on `http://localhost:5000`.

---

## Integry API Configuration
To use the Integry API, follow these steps:
1. **Sign up at [Integry](https://integry.io/)** if you haven’t already.
2. Retrieve the following details from your Integry account:
   - **User ID**: Your registered email or a custom identifier.
   - **App Key & App Secret**: Found in **Workspace Settings** in your Integry account.

Example credentials setup:
```sh
user_id = "joe@example.com"
```
These credentials will be used for authentication when interacting with the Integry API.

---

## Running the Full Application
Once both the **frontend** and **backend** are running, the application will be fully functional. You can access it via `http://localhost:3000`.

---

## Troubleshooting
- Ensure that **Node.js**, **npm**, and **Python** are installed.
- Double-check the `.env` file in the `backend` folder for missing or incorrect values.
- If the backend doesn’t start, verify that the virtual environment is activated and dependencies are installed correctly.

---

## License
This project is licensed under [Your License Here].

