from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import requests
from passlib.context import CryptContext 

load_dotenv()
app = FastAPI()
pass_context = CryptContext(schemes="bcrypt", deprecated="auto")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url = os.getenv("url")
api_key = os.getenv("ai_apikey") 
cluster = AsyncIOMotorClient(url)
Database = cluster["EdTech"]
login = Database["Login"]



class Login(BaseModel):
    username: str
    password: str
    
class Register(BaseModel):
    username: str
    password: str
    role: str 
    
@app.post("/login")
async def handle_login(data:Login):
    response = await login.find_one({"username": data.username})
    password = data.password
    if response:
        if pass_context.verify(password, response["password"]):
            return {"message": "Login Successful"}
        else:
            return {"message":"Invalid Credentials"}
    else:
        return {"message": "Sign-Up Required"}

@app.post("/sign-in")
async def handle_register(data:Register):
    response = await login.find_one({"username": data.username})
    if response:
        return {"message": "User Already Registered"}
    else:
        password = pass_context.hash(data.password)
        add_user = await login.insert_one({"username": data.username, "password": password, "role": data.role})
        return {"message": "User Registered Sucessfully"}

class AI_request(BaseModel):
    prompt: str
    username:str
    time:str

@app.post("/ai")
async def ai_response(data: AI_request):
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": "Bearer "+api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": f"You are a helpful assistant."},
                {"role": "user", "content": data.prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            completion = response.json()
            text_response = completion["choices"][0]["message"]["content"]
            return {"message":{"id": 1,"sender": "ai","parts":[{"type":"text","content":completion["choices"][0]["message"]["content"]}]}}
        else:
            print("Error:", response.status_code, response.text)
