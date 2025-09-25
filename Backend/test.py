import requests
import time
import os
import asyncio
from dotenv import load_dotenv
load_dotenv()
GLADIA_API_KEY = os.getenv("transcriber_apikey")  
api_key = os.getenv("ai_apikey")

headers = {
    "x-gladia-key": GLADIA_API_KEY,
    "Content-Type": "application/json"
}

def start_transcription(youtube_url):
    """Start transcription job directly with YouTube URL."""
    url = "https://api.gladia.io/v2/pre-recorded"
    payload = {
        "audio_url": youtube_url,   
        "subtitles": True,
        "detect_language": True
    }
    resp = requests.post(url, headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json()

async def ai_response(transcription:str):
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
            return {"message":{"id": 1,"sender": "ai","parts":[{"type":"text","content":completion["choices"][0]["message"]["content"]}]}}
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


if __name__ == "__main__":
    import asyncio

    async def main():
        youtube_url = "https://www.youtube.com/embed/uK2eFv7ne_Q?si=RouqBiMyw5InWCjE"
        job = start_transcription(youtube_url)
        
        # Either result_url or ID will be returned
        result_url = job.get("result_url") or job.get("id")
        if not result_url.startswith("http"):
            result_url = f"https://api.gladia.io/v2/pre-recorded/{result_url}"
        
        result = poll_transcription(result_url)
        transcript_text = new_extract_transcript(result)
        print(transcript_text["full_transcript"])
        MAX_LENGTH = 5000
        new_transcript_text = transcript_text["full_transcript"]
        truncated_transcript = new_transcript_text[:MAX_LENGTH]
        await ai_response(truncated_transcript)
    asyncio.run(main())


