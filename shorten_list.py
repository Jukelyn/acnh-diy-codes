"""Makes a shortened list of just the items with reported DIY IDs"""
import re

with open("inputs/list.txt", "r", encoding="utf-8") as file:
    content = file.readlines()

# Pattern to match ("DIY: CODE")
pattern = re.compile(r"DIY:\s([0-9A-F]{4})")

# Open the output file
with open("outputs/shortened_list.txt", "w", encoding="utf-8") as f:
    for line in content:
        if pattern.search(line):
            f.write(line)
