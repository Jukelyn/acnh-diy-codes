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
    """Searches the list for DIY ID.

    Args:
        diy_id (str): DIY ID to search
    """
    try:
        with open("inputs/list.txt", "r", encoding="utf-8") as f:
            found = False
            for row in f:
                if diy_id in row.upper():
                    found = True

                    print(f"\nFound: {row.strip()}\n")
                    lines.append(row.strip())

                    break
        if not found:
            print(f"DIY ID {diy_id} not found in list.txt")
    except FileNotFoundError:
        print("The file list.txt does not exist.")
        sys.exit()


def get_diy_codes() -> list[str]:
    """Finds the DIY ID from the lines and outputs an array containing the
    codes for them.

    Returns:
        list[str]: Array containing the codes for the DIY recipes
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

    get_codes = input(
        "\nDo you with to get the DIY ID codes for these? (y/n) ")

    if get_codes.lower() == "y":
        formatted_codes = get_diy_codes()
        print("\nFormatted DIY ID codes:")
        print(" ".join(formatted_codes))
    sys.exit()


def get_options() -> int:
    """Display a set of options/methods to lookup items.

    Returns:
        int: Integer that represents the option that is chosen.
    """
    print("Options:")
    print("1 - Parse text file of items")
    print("2 - Use CLI to lookup items")
    while True:
        try:
            choice = input(
                "\nWhich option would you like to use? ")
            if choice.lower() == "quit" or choice.lower() == "q":
                print("Exiting...")
                sys.exit()

            choice = int(choice)
            if choice in [1, 2]:
                break

            print("Invalid option, please enter either 1 or 2.")
        except (ValueError, TypeError):
            print("Invalid input, try again or enter \"(Q)uit\" to quit.")

    return choice


def get_file_name() -> str:
    """Gets the name of the file to be parsed.

    Returns:
        str: The name of the file to be parsed.
    """
    prompt_msg = "Enter the file's name (no extensions)"
    prompt_msg += " or type \"(Q)uit\" to quit: "

    print("What is the file name that you want to parse?")
    file_name = input(prompt_msg)

    while True:
        if file_name.lower() == "quit" or file_name.lower() == "q":
            print("Exiting...")
            sys.exit()
        if os.path.isfile(f"inputs/{file_name}.txt"):
            break

        print(f"The file {file_name}.txt does not exist.")
        file_name = input(prompt_msg)

    return file_name


def parse_file(file_name: str) -> list[str]:
    """Parses the file, searches the list for the item, and returns a list
    containing the items of the file.

    Args:
        file_name (str): The name of the file to be parsed

    Returns:
        list[str]: A list containing the items described in the file.
    """
    items = []
    with open(f"inputs/{file_name}.txt", "r", encoding="utf-8") as f:
        for item in f:
            items.append(item.strip())

    found_items = []
    not_found_items = []
    try:
        with open("inputs/list.txt", "r", encoding="utf-8") as f:
            file_lines = f.readlines()
            for item in items:
                found = False
                for row in file_lines:
                    # Search item names only
                    row_item = row.split(',')[0].strip()
                    if item.upper() == row_item.upper():
                        print(f"\nFound: {row.strip()}")
                        found_items.append(row.strip())
                        found = True
                        break
                if not found:
                    not_found_items.append(item)
    except FileNotFoundError:
        print("The file list.txt does not exist.")
        print("Exiting...")
        sys.exit()

    # print(not_found_items)
    if len(not_found_items) > 0:
        print("\nThe following items were not found in list.txt:")
        for item in not_found_items:
            print(f" - {item}")

    return found_items


def run_cli() -> None:
    """CLI prompts for IDs and outputs the items and also DIY codes"""
    while True:
        user_input = input("Paste code to search (or leave blank to quit): ")
        if user_input == "":
            if len(lines) > 0:
                print_summary()
            print("Exiting...")
            sys.exit()
        elif len(user_input) != 11 and len(user_input) != 3:
            print("Code is incorrect length. Example codes: 02B000016A2, 02B")
        else:
            lookup = "0" + user_input[:3].upper()
            print(f"Looking up DIY code {lookup}...")
            lookup_code(lookup)


match get_options():
    case 1:
        file = get_file_name()
        parse_file(file)
    case 2:
        run_cli()
