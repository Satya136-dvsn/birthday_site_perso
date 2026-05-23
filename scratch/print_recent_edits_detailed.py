import json
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

transcript_path = "C:/Users/ACER/.gemini/antigravity/brain/8e307550-6dfe-4d57-be2b-fd2de62f6635/.system_generated/logs/transcript.jsonl"
edits = []

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        step = json.loads(line)
        if step.get("type") == "CODE_ACTION":
            # Let's inspect the step fields
            tool_calls = step.get("tool_calls", [])
            edits.append({
                "step_index": step.get("step_index"),
                "status": step.get("status"),
                "created_at": step.get("created_at"),
                "tool_calls_summary": [tc.get("name") for tc in tool_calls],
                "tool_calls": tool_calls
            })

print(f"Total CODE_ACTION steps: {len(edits)}")
for edit in edits[-15:]: # print last 15
    print(f"Step {edit['step_index']} (Status: {edit['status']}): {edit['tool_calls_summary']}")
    for tc in edit['tool_calls']:
        args = tc.get("arguments", {})
        target = args.get("TargetFile", args.get("AbsolutePath", ""))
        print(f"  Tool: {tc.get('name')}, Target: {target}")
        if "Instruction" in args:
            print(f"    Instruction: {args['Instruction']}")
        if "Description" in args:
            print(f"    Description: {args['Description']}")
