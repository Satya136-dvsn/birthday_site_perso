import re

with open("c:/birthday site/script.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

print("EVENT LISTENERS:")
for i, line in enumerate(lines):
    if ".addEventListener" in line:
        print(f"Line {i+1}: {line.strip()}")

print("\nGET ELEMENT BY ID / QUERY SELECTOR TARGETS:")
for i, line in enumerate(lines):
    matches = re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", line)
    for m in matches:
        print(f"Line {i+1}: getElementById('{m}')")
    q_matches = re.findall(r"document\.querySelector\(['\"]([^'\"]+)['\"]\)", line)
    for qm in q_matches:
        print(f"Line {i+1}: querySelector('{qm}')")
