from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import requests
from passlib.context import CryptContext 
from youtube_transcript_api import YouTubeTranscriptApi
import re
import youtube_transcript_api
print(f"--- Python is importing youtube_transcript_api from this location: {youtube_transcript_api.__file__} ---")

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
lessons = Database["Lessons"]



class Login(BaseModel):
    username: str
    password: str
    
class Register(BaseModel):
    username: str
    password: str
    role: str 
    school: str
    
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
        add_user = await login.insert_one({"username": data.username, "password": password, "role": data.role, "school": data.school})
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

class lesson(BaseModel):
    title: str
    url: str
    subject: str
    description: str    
    username: str
    classid: str
    
    
def get_video_id(url: str) -> str:
    # Patterns for different formats
    patterns = [
        r"v=([a-zA-Z0-9_-]{11})",          # normal watch URL
        r"embed/([a-zA-Z0-9_-]{11})",      # embed URL
        r"shorts/([a-zA-Z0-9_-]{11})"      # shorts URL
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None   

async def handle_summary(transcript:str):
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": "Bearer "+api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": f"You are a helpful assistant.You have to generate a detailed summary of this transcript."},
                {"role": "user", "content": transcript}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            completion = response.json()
            text_response = completion["choices"][0]["message"]["content"]
            return text_response
        else:
            print("Error:", response.status_code, response.text)
    
     

@app.post("/newlesson")
async def create_new_lesson(data:lesson):
        print("Call Received")
        video_id = get_video_id(data.url)
        print("Got Video ID:", video_id)
        transcript = await handle_transcript(video_id)
        print("Got Transcript:", transcript)
        summary = await handle_summary(transcript)
        print("Summary:",summary)
        response = await lessons.insert_one({"title": data.title, "url": data.url, "subject": data.subject, "description": data.description, "username": data.username, "classid": data.classid, "thumbnail": "https://placehold.co/600x400/e2e8f0/4a5568?text=Algebra", "summary": summary})
        return {"message": "Lesson Created Successfully."}
    
@app.get("/fetchlesson")
async def fetch_lessons():
    response = await lessons.find().to_list(length=10)
    for i in response:
        i["_id"] = str(i["_id"])
    return {"message": response}

class findLesson(BaseModel):
    lesson:str

@app.post("/findlesson")
async def find_lesson(data:findLesson):
    response = await lessons.find_one({"title": data.lesson})
    response["_id"] = str(response["_id"])
    return {"message": response}



def handle_transcript(video_url:str):
   video_id = video_url 
   transcript = YouTubeTranscriptApi.get_transcript(video_id)
   text = " ".join([entry['text'] for entry in transcript])
   return text