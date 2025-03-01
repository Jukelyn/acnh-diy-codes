# ACNH DIY Codes for OmegaToGo Bots
This project takes all the possible DIY recipes as reported in the dataset [here](https://mpql.net/tools/acnh/codes/item-list/) and outputs the codes in the format that lets them be used in the OmegaToGo bots in the NooksTreasureIslands Discord.

## Information
`list.txt` is the list of all the items with the DIY IDs included.

`diy_codes_output.txt` is 1 DIY codes per line

`grouped_diy_codes_output.txt` is the DIY codes in groups of 40 per line

`lookup.py` is an extra script to lookup DIY Recipe codes against the list to show which item they
are associated to.


## Usage
`python main.py`: Runs the main script. This script does *not* need to actually be ran unless the `list.txt` (from the above linked site) is updated in the future (date as of writing this is 1 March 2025). The outputted files are provided as either 1 DIY recipe per line or groups of 40 in `diy_codes_output.txt` and `grouped_diy_codes_output.txt`, respectively.

`python lookup.py`: Runs the lookup script. It prompts for the 11-digit code to be entered and it checks if the code is associated with an item in the `list.txt` file. If it is, it outputs the relevant information for that item.

## Example order
Line 1 from `grouped_diy_codes_output.txt` contains the following:
```
0A4000016A2 066000016A2 02B000016A2 0BE000016A2 115000016A2 02A000016A2 029000016A2 067000016A2 02C000016A2 246000016A2 247000016A2 248000016A2 249000016A2 037000016A2 02D000016A2 28D000016A2 167000016A2 0AB000016A2 02E000016A2 0D9000016A2 030000016A2 031000016A2 021000016A2 427000016A2 033000016A2 020000016A2 0D8000016A2 010000016A2 174000016A2 426000016A2 038000016A2 24A000016A2 19D000016A2 0EA000016A2 0D7000016A2 039000016A2 19A000016A2 28F000016A2 03A000016A2 03B000016A2
```

Doing 
```
[BOT PREFIX]order 0A4000016A2 066000016A2 02B000016A2 0BE000016A2 115000016A2 02A000016A2 029000016A2 067000016A2 02C000016A2 246000016A2 247000016A2 248000016A2 249000016A2 037000016A2 02D000016A2 28D000016A2 167000016A2 0AB000016A2 02E000016A2 0D9000016A2 030000016A2 031000016A2 021000016A2 427000016A2 033000016A2 020000016A2 0D8000016A2 010000016A2 174000016A2 426000016A2 038000016A2 24A000016A2 19D000016A2 0EA000016A2 0D7000016A2 039000016A2 19A000016A2 28F000016A2 03A000016A2 03B000016A2
```
will start an order for these DIY recipes. Follow rules and instructions mentioned in the discord to proceed from this point.

There are 24 groups of 40 DIY Recipes available from the source data, meaning 24 orders/trips need to be made to learn all of them.

It can take anywhere from 3 to 4 hours to order, fly, get, and learn all of the DIY recipes in this list.