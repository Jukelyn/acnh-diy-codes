"""This script takes all the possible DIY recipes as reported in the dataset
[here](https://mpql.net/tools/acnh/codes/item-list/) and outputs the codes in
the format that lets them be used in the OmegaToGo bots in the
NooksTreasureIslands Discord.
"""
import re

with open("list.txt", "r", encoding="utf-8") as file:
    content = file.readlines()

# Pattern to match ("DIY: CODE")
pattern = re.compile(r"DIY:\s([0-9A-F]{4})")

# Extract DIY codes
diy_codes = [match.group(1)
             for line in content for match in pattern.finditer(line)]

# Change the array elements to use the proper format
for i, code in enumerate(diy_codes):
    diy_codes[i] = code[-3:] + "000016A2"

# Output codes 1 per line
with open("diy_codes_output.txt", "w", encoding="utf-8") as output_file:
    for code in diy_codes:
        output_file.write(code.lower() + "\n")

# Output codes 40 per line (for max inventory requests)
with open('grouped_diy_codes_output.txt', 'w', encoding="utf-8") as f:
    for i in range(0, len(diy_codes), 40):
        group_number = i // 40 + 1
        f.write(f"Group {group_number}:\n")
        f.write(" ".join(diy_codes[i:i+40]) + "\n\n")
