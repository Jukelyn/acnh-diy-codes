"""Script to lookup DIY Recipe codes against the list to show which item they
are associated to.
"""
import sys
import os
import re


def clear_terminal() -> None:
    """Clears the terminal."""
    os.system('cls' if os.name == 'nt' else 'clear')


lines = []


def lookup_code(diy_id: str) -> None:
    """Searched list for DIY ID.

    Args:
        diy_id (str): DIY ID to search
    """
    try:
        with open("shortened_list.txt", "r", encoding="utf-8") as file:
            found = False
            for row in file:
                if diy_id in row.upper():
                    found = True

                    print(f"\nFound: {row.strip()}\n")
                    lines.append(row.strip())

                    break
        if not found:
            print(f"DIY ID {diy_id} not found in shortened_list.txt")
    except FileNotFoundError:
        print("The file shortened_list.txt does not exist")
        sys.exit()


def get_diy_codes() -> list[str]:
    """Finds the DIY ID from the lines and outputs an array containing the
    codes for them.

    Returns:
        list[str]: array containing the codes for the DIY recipes
    """
    codes = []

    for line in lines:
        match = re.search(r'DIY: (\w+)', line)
        if match:
            codes.append(match.group(1)[-3:] + "000016A2")

    return codes


def print_summary() -> None:
    """Prints a summary of the codes that were searched and found."""
    clear_terminal()
    print("Here are the codes you searched for:\n")

    for line in lines:
        print(line)

    get_codes = input("Do you with to get the DIY ID codes for these? (y/n) ")

    if get_codes.lower() == "y":
        formatted_codes = get_diy_codes()
        print("\nFormatted DIY ID codes:")
        print(" ".join(formatted_codes))

    sys.exit()


while True:
    user_input = input("Paste code to search (or leave blank to quit): ")
    if user_input == "":
        if len(lines) > 0:
            print_summary()
        print("Exiting...")
        sys.exit()
    elif len(user_input) != 11 and len(user_input) != 3:
        print("Code is incorrect length. Example code: 02B000016A2 OR 02B")
    else:
        lookup = "0" + user_input[:3].upper()
        print(f"Looking up DIY code {lookup}...")
        lookup_code(lookup)
