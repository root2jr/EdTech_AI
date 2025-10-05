import yagmail
import os
from dotenv import load_dotenv

load_dotenv()
email = os.getenv("email")
password = os.getenv("password")
ya = yagmail.SMTP(email,password)
send = ya.send(to="jram6269@gmail.com", subject="New Student Joined!", contents="Your New Class Details! \nClass ID: 'MATH-35T49' \nClass-Name: 'MATHS'")