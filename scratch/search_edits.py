with open("c:/birthday site/script.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if ".addEventListener" in line:
        print(f"Line {i+1}: {line.strip()}")
    # Let's also check for potentially missing element IDs
    match = re.search(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", line) if 're' in globals() else None
