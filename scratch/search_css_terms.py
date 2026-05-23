import re

with open("c:/birthday site/styles.css", "r", encoding="utf-8") as f:
    content = f.read()

for match in re.finditer(r"next-to-letter|after-blow-message", content):
    start = max(0, match.start() - 100)
    end = min(len(content), match.end() + 100)
    print(f"Match at index {match.start()}:\n{content[start:end]}\n{'-'*40}")
