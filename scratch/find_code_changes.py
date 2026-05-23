import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = "C:/Users/ACER/.gemini/antigravity/brain/8e307550-6dfe-4d57-be2b-fd2de62f6635/.system_generated/logs/transcript.jsonl"
with open(transcript_path, "r", encoding="utf-8") as f:
    for i in range(5):
        line = f.readline()
        if not line:
            break
        print(f"Line {i+1}: {line[:300]}...")
