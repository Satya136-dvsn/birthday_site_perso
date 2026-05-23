import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = "C:/Users/ACER/.gemini/antigravity/brain/8e307550-6dfe-4d57-be2b-fd2de62f6635/.system_generated/logs/transcript.jsonl"

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        step = json.loads(line)
        idx = step.get("step_index")
        if 1440 <= idx <= 1480:
            print(f"Step {idx}: {step.get('source')} - {step.get('type')}")
            # Print a bit of content
            content = step.get("content", "")
            if content:
                print(f"  Content: {content[:300]}...")
            print("-" * 50)
