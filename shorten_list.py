import re

with open("list.txt", "r", encoding="utf-8") as file:
    content = file.readlines()

# Pattern to match ("DIY: CODE")
pattern = re.compile(r"DIY:\s([0-9A-F]{4})")

# Open the output file
with open("shortened_list.txt", "w", encoding="utf-8") as output_file:
    for line in content:
        if pattern.search(line):
            output_file.write(line)
