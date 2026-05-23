import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = "C:/Users/ACER/.gemini/antigravity/brain/8e307550-6dfe-4d57-be2b-fd2de62f6635/.system_generated/logs/transcript.jsonl"
step_types = set()

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        step = json.loads(line)
        step_types.add(step.get("type"))

print("All step types in logs:")
print(step_types)
