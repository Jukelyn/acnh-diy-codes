import re

with open("list.txt", "r", encoding="utf-8") as file:
    content = file.readlines()


pattern = re.compile(r"DIY:\s([0-9A-F]{4})")

# Extract DIY codes
diy_codes = [match.group(1)
             for line in content for match in pattern.finditer(line)]

for i, code in enumerate(diy_codes):
    diy_codes[i] = code[-3:]

with open("diy_codes_output.txt", "w", encoding="utf-8") as output_file:
    for code in diy_codes:
        output_file.write(code.lower() + "\n")
