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
import time
import asyncio
from bson import ObjectId

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
GLADIA_API_KEY = os.getenv("transcriber_apikey")  
lessons = Database["Lessons"]
schools = Database["Schools"]
classes = Database["classes"]


class Login(BaseModel):
    username: str
    password: str
    
class Register(BaseModel):
    username: str
    password: str
    schoolid: str
    studentid: str
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
    print(data)
    if response:
        return {"message": "User Already Registered"}
    else:
        school_authenticity = await schools.find_one({"school_id":data.schoolid})
        if school_authenticity:
            print("School Authenticity Verified.")
            if data.role == "Student":
                print("Student IF Statement Works")
                students = school_authenticity["students"]
                saved = False                
                for student in students:
                   if student["student_id"] == data.studentid:
                      password = pass_context.hash(data.password)
                      add_user = await login.insert_one({"username": data.username, "password": password, "role": data.role, "school": data.schoolid})
                      return {"message": "User Registered Sucessfully"}
                if not saved:
                   return {"message": "Invalid Student id."}
            elif data.role == "Teacher":
                teachers = school_authenticity["faculties"]
                saved = False
                for teacher in teachers:
                   if teacher["faculty_id"] == data.studentid:
                      password = pass_context.hash(data.password)
                      add_user = await login.insert_one({"username": data.username, "password": password, "role": data.role, "school": data.schoolid})
                      return {"message": "User Registered Sucessfully"}
                if not saved:
                   return {"message": "Invalid Student id."}
        else:
            return {"message": "School not registered"}
       

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





def start_transcription(youtube_url):
    """Start transcription job directly with YouTube URL."""
    url = "https://api.gladia.io/v2/pre-recorded"
    headers = {
    "x-gladia-key": GLADIA_API_KEY,
    "Content-Type": "application/json"
}
    payload = {
        "audio_url": youtube_url,   
        "subtitles": True,
        "detect_language": True
    }
    resp = requests.post(url, headers=headers, json=payload)
    resp.raise_for_status()
    job = resp.json()
    result_url = job.get("result_url") or job.get("id")
    if not result_url.startswith("http"):
        result_url = f"https://api.gladia.io/v2/pre-recorded/{result_url}"
        
    result = poll_transcription(result_url)
    transcript_text = new_extract_transcript(result)
    return transcript_text["full_transcript"]


async def new_ai_response(transcription:str):
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": "Bearer "+api_key,
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama-3.1-8b-instant",
            "messages": [
                {"role": "system", "content": f"You are a helpful assistant."},
                {"role": "user", "content": f"Create a detailed summary for this transcription:{transcription}"}
            ],
            "temperature": 0.7,
            "max_tokens": 500
        }

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code == 200:
            completion = response.json()
            text_response = completion["choices"][0]["message"]["content"]
            print(text_response)
            return completion["choices"][0]["message"]["content"]
        else:
            print("Error:", response.status_code, response.text)


def new_extract_transcript(data):
    """
    Converts Gladia response JSON into a single string transcript.
    """
    # case 1: raw transcription string
    if isinstance(data, str):
        return data
    
    # case 2: transcription inside a dict
    if isinstance(data, dict):
        # direct transcription
        if "transcription" in data:
            return data["transcription"]
        # inside result
        if "result" in data and "transcription" in data["result"]:
            return data["result"]["transcription"]
        # if subtitles list
        if "subtitles" in data:
            lines = [s.get("transcription", "") for s in data["subtitles"]]
            return " ".join(lines)
    
    return ""


def poll_transcription(result_url):
    """Poll until transcription done, then return result."""
    headers = {
    "x-gladia-key": GLADIA_API_KEY,
    "Content-Type": "application/json"
}
    while True:
        resp = requests.get(result_url, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        status = data.get("status")
        if status == "done":
            return data["result"]
        elif status == "error":
            raise RuntimeError("Transcription error: " + str(data))
        else:
            time.sleep(2)  # wait and retry

def chunk_text(text, chunk_size=3000):
    words = text.split()
    for i in range(0, len(words), chunk_size):
        yield " ".join(words[i:i+chunk_size])

async def ask_ai_mcq(transcription):
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": "Bearer " + api_key,
        "Content-Type": "application/json"
    }

    example_format = """[
  {
    "id": 1,
    "question": "What is the process of checking one's clearance level before entering a secure area?",
    "options": ["Authentication", "Authorization", "Clearance Check", "Digital Screening"],
    "answer": "Clearance Check"
  },
  {
    "id": 2,
    "question": "What is the major challenge in cybersecurity due to the increased use of distributed devices?",
    "options": ["Centralized Management", "Easy Access", "Potential Attack Vectors", "Distributed Denial of Service"],
    "answer": "Potential Attack Vectors"
  },
  {
    "id": 3,
    "question": "What is the term for protecting systems, networks, and applications from digital attacks or compromise?",
    "options": ["Cybersecurity", "Network Security", "System Protection", "Information Assurance"],
    "answer": "Cybersecurity"
  },
  {
    "id": 4,
    "question": "What is the main reason why cybersecurity is important for organizations and governments?",
    "options": ["Preventing Data Loss", "Ensuring Compliance", "Protecting Intellectual Property", "Minimizing Financial Loss"],
    "answer": "Minimizing Financial Loss"
  },
  {
    "id": 5,
    "question": "What are the three basic things a company or organization needs regarding security?",
    "options": ["Authentication, Authorization, Encryption", "Confidentiality, Integrity, Availability", "Security, Compliance, Risk Management", "Authentication, Authorization, Access Control"],
    "answer": "Authentication, Authorization, Access Control"
  }
]
"""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"Create 5 MCQ questions for the given transcription:\n{transcription}\n\nUse this Exact format:\n{example_format} \n No other words or sentences."}
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
        transcript = start_transcription(data.url)
        MAX_LENGTH = 5000
        truncated_transcript = transcript[:MAX_LENGTH]
        summary = await new_ai_response(truncated_transcript)
        mcqs = await ask_ai_mcq(truncated_transcript)
        response = await lessons.insert_one({"title": data.title, "url": data.url, "subject": data.subject, "description": data.description, "username": data.username, "classid": data.classid, "thumbnail": "https://placehold.co/600x400/e2e8f0/4a5568?text=Algebra", "summary": summary, "transcription": truncated_transcript,"mcqs":mcqs})
        return {"message": "Lesson Created Successfully."}

class findLesson(BaseModel):
    class_id: str
    
@app.post("/fetchlesson")
async def fetch_lessons(data:findLesson):
    response = await lessons.find({"classid": data.class_id}).to_list(length=10)
    for i in response:
        i["_id"] = str(i["_id"])
    return {"message": response}

class findLesson(BaseModel):
    lesson:str

@app.post("/findlesson")
async def find_lesson(data:findLesson):
    response = await lessons.find_one({"_id": ObjectId(data.lesson)})
    response["_id"] = str(response["_id"])
    return {"message": response}

class Createclass(BaseModel):
    classId: str 
    className: str 
    subject: str 
    description: str
    teacher: str
    schoolid: str

@app.post("/createclass")
async def create_class(data:Createclass):
        response = await classes.insert_one({"classId": data.classId, "className": data.className,"subject": data.subject, "description": data.description, "schoolid": data.schoolid, "teacher": data.teacher})
        return {"message": "Class Created Successfully"}
    

class Query(BaseModel):
    query: str
    
@app.post("/searchclass")
async def search_class(data:Query):
    response = await classes.find({"classId": data.query}).to_list(length=None)
    for value in response:
        value["_id"] = str(value["_id"])
    return {"message": response}




