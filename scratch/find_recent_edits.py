import json

transcript_path = "C:/Users/ACER/.gemini/antigravity/brain/8e307550-6dfe-4d57-be2b-fd2de62f6635/.system_generated/logs/transcript.jsonl"
edits = []

with open(transcript_path, "r", encoding="utf-8") as f:
    for line in f:
        step = json.loads(line)
        if "tool_calls" in step:
            for tc in step["tool_calls"]:
                if tc.get("name") in ["replace_file_content", "multi_replace_file_content", "write_to_file"]:
                    args = tc.get("arguments", {})
                    target = args.get("TargetFile", "")
                    if "script.js" in target or "index.html" in target:
                        edits.append({
                            "step_index": step.get("step_index"),
                            "tool": tc.get("name"),
                            "target": target,
                            "description": args.get("Description", "")
                        })

print(f"Total edits found: {len(edits)}")
for edit in edits[-10:]: # last 10 edits
    print(f"Step {edit['step_index']}: {edit['tool']} on {os.path.basename(edit['target']) if 'os' in globals() else edit['target']} - {edit['description']}")
