import csv


hex_codes = []

with open('diys.csv', mode='r', encoding="utf-8") as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # Skip header row
    for code in csv_reader:
        hex_codes.append(code[1])

output = []
# Get last 3 characters, put at front
# and 16A2 at the end with 0000 in between
for code in hex_codes:
    output.append(code[-3:] + "000016A2")

with open('output.txt', 'w', encoding="utf-8") as f:
    for i in range(0, len(output), 40):
        f.write(" ".join(output[i:i+40]) + "\n")
