import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = "C:/Users/ACER/.gemini/antigravity/brain/8e307550-6dfe-4d57-be2b-fd2de62f6635/.system_generated/logs/transcript.jsonl"
with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        step = json.loads(line)
        if step.get("type") == "CODE_ACTION":
            last_code_action = step

print("Keys in CODE_ACTION step:")
print(list(last_code_action.keys()))
print("Full JSON content (truncated):")
print(json.dumps(last_code_action, indent=2)[:2000])
