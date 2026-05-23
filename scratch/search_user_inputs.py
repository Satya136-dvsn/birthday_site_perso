import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = "C:/Users/ACER/.gemini/antigravity/brain/8e307550-6dfe-4d57-be2b-fd2de62f6635/.system_generated/logs/transcript.jsonl"
user_inputs = []

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        step = json.loads(line)
        if step.get("type") == "USER_INPUT":
            user_inputs.append(step)

print(f"Total user inputs: {len(user_inputs)}")
for idx, ui in enumerate(user_inputs):
    print(f"\n[{idx}] Step {ui.get('step_index')} (Created at {ui.get('created_at')}):")
    print(ui.get("content"))
    print("="*60)
