import sys

while True:
    user_input = input("Paste code to search (or leave blank to quit): ")
    if user_input == "":
        print("Exiting...")
        sys.exit()
    elif len(user_input) != 11:
        print("Code is incorrect length. Example code: 02B000016A2")
    else:
        lookup = "0" + user_input[:3].upper()
        print(f"Looking up DIY code {lookup}...")
        try:
            with open("list.txt", "r", encoding="utf-8") as file:
                FOUND = False
                for line in file:
                    if lookup in line.upper():
                        FOUND = True
                        print(f"\nFound: {line.strip()}\n")
                        break
            if not FOUND:
                print(f"Code {lookup} not found in list.txt")
        except FileNotFoundError:
            print("The file list.txt does not exist")
