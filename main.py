import re

with open("list.txt", "r", encoding="utf-8") as file:
    content = file.readlines()

# Regex pattern to match "DIY: XXXX"
pattern = re.compile(r"DIY:\s([0-9A-F]{4})")

# Extract DIY codes
diy_codes = [match.group(1)
             for line in content for match in pattern.finditer(line)]


# Print the codes in groups of 40 with spaces in between each code
for i in range(0, len(diy_codes), 40):
    print(" ".join(diy_codes[i:i + 40]))
    print()
