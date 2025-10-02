from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import requests
from passlib.context import CryptContext 
import re
import time
from bson import ObjectId
import random
import string
from jose import JWTError, jwt
from datetime import datetime, timedelta

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
Analytics = Database["Analytics"]
collection = Database["Topic-Details"]
details = Database["Topic-Content"]

class Login(BaseModel):
    email: str
    password: str
    role: str
    
class Register(BaseModel):
    username: str
    password: str
    schoolid: str
    studentid: str
    role: str
    email: str 
    joined: str
    
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = 30
    
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() +  timedelta(days=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt   
    
@app.post("/login")
async def handle_login(data:Login):
    response = await login.find_one({"email": data.email})
    password = data.password
    if response:
        if pass_context.verify(password, response["password"]) and data.role == response["role"]:
            jwt = create_access_token({"sub":data.email})
            return {"message": "Login Successful","user_id":response["user_id"],"jwt":jwt}
        else:
            return {"message":"Invalid Credentials"}
    else:
        return {"message": "Sign-Up Required"}
    
    

def generate_class_id():
    subj = "EdTech"
    prefix = subj.upper()
    
    # Generate 6 random alphanumeric characters
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

    
    return f"{prefix}-{random_part}"

@app.post("/sign-in")
async def handle_register(data:Register):
    response = await login.find_one({"email": data.email})
    if response:
        return {"message": "User Already Registered"}
    else:
        school_authenticity = await schools.find_one({"school_id":data.schoolid})
        if school_authenticity:
            if data.role == "Student":
                students = school_authenticity["students"]
                saved = False                
                for student in students:
                   if student["student_id"] == data.studentid:
                      reg = await login.find_one({"student_id":data.studentid})
                      if reg:
                          return {"message": "User Already Registered With This Student ID."}
                      password = pass_context.hash(data.password)
                      user_id = generate_class_id()
                      add_user = await login.insert_one({"email":data.email,"username": data.username, "password": password, "role": data.role, "school_id": data.schoolid ,"user_id": user_id,"student_id":data.studentid,"joined":data.joined})
                      return {"message": "User Registered Sucessfully"}
                if not saved:
                   return {"message": "Invalid Student id."}
            elif data.role == "Teacher":
                teachers = school_authenticity["faculties"]
                saved = False
                for teacher in teachers:
                   if teacher["faculty_id"] == data.studentid:
                      reg = await login.find_one({"staff_id":data.studentid})
                      if reg:
                          return {"message": "User Already Registered With This Student ID."}
                      password = pass_context.hash(data.password)
                      user_id = generate_class_id()                      
                      add_user = await login.insert_one({"email":data.email,"username": data.username, "password": password, "role": data.role, "school_id": data.schoolid, "user_id": user_id, "staff_id":data.studentid,"joined":data.joined})
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
                {"role": "system", "content": f"You are a helpful assistant. "},
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
    user_id: str
    classid: str
    lesson_id: str
    
    
    
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
                {"role": "user", "content": f"Create a detailed summary for this transcription:{transcription}, Remember the response should not exceed 500 tokens."}
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
        lesson_id = generate_class_id()
        response = await lessons.insert_one({"lesson_id": data.lesson_id,"title": data.title, "url": data.url, "subject": data.subject, "description": data.description, "user_id": data.user_id, "classid": data.classid, "summary": summary, "transcription": truncated_transcript,"mcqs":mcqs})
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
    user_id: str

async def handle_teacher_analytics_one(userid:str, classid:str):
    response = await Analytics.find_one_and_update({"user_id":userid},{"$inc":{"classes":1}},upsert=True)
    addclass = await login.find_one_and_update({"user_id":userid},{"$addToSet":{"classes":classid}})
    return True

@app.post("/createclass")
async def create_class(data:Createclass):
        response = await classes.insert_one({"classId": data.classId, "className": data.className,"subject": data.subject, "description": data.description, "schoolid": data.schoolid, "teacher": data.teacher, "creator": data.user_id})
        await handle_teacher_analytics_one(data.user_id, data.classId)
        return {"message": "Class Created Successfully"}
    

class Query(BaseModel):
    query: str
    
@app.post("/searchclass")
async def search_class(data:Query):
    response = await classes.find({"classId": data.query}).to_list(length=None)
    for value in response:
        value["_id"] = str(value["_id"])
    return {"message": response}


class analytics(BaseModel):
    user_id: str


@app.post("/fetchanalytics")
async def fetch_analytics(data:analytics):
    response = await Analytics.find_one({"student_id": data.user_id})
    response["_id"] = str(response["_id"])
    return {"message": response}

class Completed_lesson(BaseModel):
    user_id: str
    lesson_id: str
    quiz_marks: int
    

    
    
        
async def handle_student_analytics(userid: str,lessonid: str):
    response = await login.find_one({"user_id": userid})
    lessonsdone = response["lessons"]
    lessonsCompleted = len(response["lessons"])
    print(lessonsCompleted)
    scores = [l["quiz_marks"] for l in lessonsdone]
    averageScore = (round(sum(scores) / len(scores))*20 if scores else 0)
    weeklygoal = round(sum(scores)/7)*20
    subject_scores = {}
    recentActivity = []
    
    for l in lessonsdone:
       print(l["lesson_id"])
       lesson_doc = await lessons.find_one({"lesson_id": l["lesson_id"]})
       subject = lesson_doc["subject"]
       
       if subject not in subject_scores:
           subject_scores[subject] = []
           
       subject_scores[subject].append(l["quiz_marks"])
    proficiency = [
           {"subject": subj, "score": sum(marks)/len(marks)}
           for subj, marks in subject_scores.items()]
    insert_analytics = await Analytics.find_one_and_update({"student_id":userid},{"$set":{"lessonsCompleted":lessonsCompleted,"averageScore":averageScore,"weeklyGoal":weeklygoal,"proficiency":proficiency}},upsert=True)
    insert_completion = await lessons.find_one_and_update({"lesson_id":lessonid},{"$addToSet":{"completed_students":userid}})
    return True




@app.post("/lessoncompleted")
async def mark_lesson_complete(data:Completed_lesson):
    obj = {"user_id": data.user_id, "lesson_id": data.lesson_id, "quiz_marks": data.quiz_marks}
    response = await login.find_one_and_update({"user_id": data.user_id},{"$addToSet": {"lessons":obj}})
    await handle_student_analytics(data.user_id,data.lesson_id)
    return {"message": "Lesson Completion Updated."}
        
        
        
class Joinclass(BaseModel):
    user_id: str
    class_id: str
@app.post("/joinclass")
async def handle_join_class(data:Joinclass):
    user = await login.find_one({"user_id": data.user_id})
    targetclass = await classes.find_one({"classId": data.class_id})
    if user["school_id"] == targetclass["schoolid"]:
        response = await classes.find_one_and_update({"classId": data.class_id},{"$addToSet": {"students":data.user_id}} )
        response2 = await login.find_one_and_update({"user_id": data.user_id},{"$addToSet": {"classes":data.class_id}} )
        return {"message": "Class Joined Successfully"}
    else:
        return {"message": "Unable to Join class"}

class fetch_class(BaseModel):
    user_id: str    
@app.post("/fetch-classes")
async def fetch_classes(data:fetch_class):
    response = await login.find_one({"user_id": data.user_id})
    user_classes = response["classes"]
    
    finalclass = []
    for clas in user_classes:
        newclass  = await classes.find_one({"classId": clas})
        if not newclass: 
            return {"message": "unable to find classes."}
        newclass["_id"] = str(newclass["_id"])
        finalclass.append(newclass)
    return {"message": finalclass}

class TeacherClass(BaseModel):
    user_id: str    
@app.post("/fetch-teacher-class")
async def fetch_teacher_class(data:TeacherClass):
    response = await classes.find({"creator": data.user_id}).to_list(length=None)
    for res in response:
        res["_id"] = str(res["_id"])
    return {"message": response}

async def handle_class_wise_analytics(userid: str):
    response = await classes.find({"creator": userid}).to_list(length=None)
    class_wise = []
    for active_class in response:
        active_class_lessons = await lessons.find({"classid":active_class["classId"]}).to_list(length=None)
        if not active_class_lessons:
            continue
        total_students = 0
        completed_students = 0
        for less in active_class_lessons:
            completed_students += len(less["completed_students"])
        total_students += len(active_class["students"])            
        if total_students > 0:
           completion_rate = (completed_students / total_students) * 100
        else:
           completion_rate = 0  
        class_wise.append({"classid":active_class["classId"],"completion_rate": completion_rate})
    return class_wise 







async def handle_teacher_analytics(userid: str):
    teacher_classes = await classes.find({"creator":userid}).to_list(length=None)
    active_classes = len(teacher_classes)
    response = await lessons.find({"user_id":userid}).to_list(length=None)
    completed_students = 0
    total_students = 0
    for entry in response:
       completed_students += len(entry.get("completed_students") or [])
       class_id = await classes.find_one({"classId":entry["classid"]})
       total_students += len(class_id["students"])
    if total_students > 0:
       completion_rate = (completed_students / total_students) * 100
    else:
       completion_rate = 0
    class_wise_analytics = await handle_class_wise_analytics(userid)
    update_analytics = await Analytics.find_one_and_update({"user_id":userid},{"$set":{"user_id":userid,"total_students": total_students, "completion_rate": completion_rate, "active_classes": active_classes,"class_wise_analytics":class_wise_analytics}},upsert=True)
    return {"total_students": total_students, "completion_rate": completion_rate, "active_classes": active_classes,"class_wise_analytics":class_wise_analytics}

class FetchTeacherAnalytics(BaseModel):
    user_id: str
    
@app.post("/fetch-teacher-analytics")
async def fetch_teacher_analytics(data:FetchTeacherAnalytics):
    response = await handle_teacher_analytics(data.user_id)
    return {"message":response}


@app.get("/content/{content_id}")
def get_content(content_id: str):
    result = collection.find_one({"id": content_id}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="Content not found")
    return result

@app.get("/fetchtopics")
async def get_all_contents():
   response = await collection.find().to_list(length=10)
   for topic in response:
       topic["_id"] = str(topic["_id"])
   return {"message": response}

@app.get("/fetchtopicdetails")
async def get_topic_details():
    response = await details.find_one({})
    response["_id"] = str(response["_id"])
    return {"message": response}


class User_Details(BaseModel):
    user_id: str

@app.post("/fetch-user-details")
async def fetch_user_details(data:User_Details):
    response = await login.find_one({"user_id": data.user_id})
    logo = response["username"]
    newlogo = logo[0:2]
    return {"name": response["username"],"email":response["email"],"role":response["role"],"joinDate": response["joined"], "avatarUrl": f'https://placehold.co/128x128/1d1d1f/f5f5f7?text={newlogo}&font=inter'}