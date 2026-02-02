from pathlib import Path
import pandas as pd


def add_hex_id_col(df: pd.DataFrame) -> None:
    """
    Adds the "Internal ID as hex" column if the frame has a "Internal ID"
    column and fills it.

    Args:
        df (pd.DataFrame): The dataframe to be parsed.

    Returns:
        None: The dataframe is edited in-place.
    """
    if "Internal ID" in df.columns:
        df["Internal ID as hex"] = df["Internal ID"].apply(
            # 4 digits, uppercase, padded with zeros
            lambda x: format(x, '04X'))


def add_variation_pattern_col(df: pd.DataFrame) -> None:
    """
    Adds the "Variant Pattern Encoded" column if the frame has a "Variant ID"
    column and fills it.

    Args:
        df (pd.DataFrame): The dataframe to be parsed.

    Returns:
        None: The dataframe is edited in-place.
    """
    if "Variant ID" in df.columns:
        df["Variant Pattern Encoded"] = df["Variant ID"].apply(
            make_variant_info)


def make_variant_info(variantId: str) -> tuple[int, int]:
    """
    The column "Variant ID" has values either NaN or X_Y where X and Y are
    between 0 and 9. X are the variants, Y are the patterns.

    Args:
        variantId (str): Variant ID of the item

    Returns:
        tuple[int, int]: Encoded variation + pattern.
    """
    if not variantId or not isinstance(variantId, str):
        return None  # No variations or patterns

    variation, pattern = variantId.split("_")

    return (int(variation), int(pattern) * 32)


def get_encoded_item_variant(item_id: str, variantion: int = 0,
                             pattern: int = 0) -> str:
    """
    Encode an item ID with either one or two customization options into a
    16-digit hex string.

    Args:
        item_id (str): the item ID as a hex string, 4 digits.
        variantion (int, optional): Variantion. Defaults to 0.
        pattern (int, optional): Pattern. Defaults to 0.

    Raises:
        ValueError: If the pattern is not a multiple of 32.

    Returns:
        str: 16-character hex string encoding, if not default.
    """
    if not isinstance(variantion, int):
        raise TypeError("Variation needs to be an integer.")

    if not isinstance(pattern, int):
        raise TypeError("Pattern needs to be an integer multiple of 32.")

    if pattern % 32 != 0:
        raise ValueError("Pattern needs to be a multiple of 32.")

    # If both variants are zero, return the item_id as-is, default item.
    if variantion == 0 and pattern == 0:
        return str(item_id)

    # Patterns are hex
    # 000 -> 0
    # 032 -> 20
    # 064 -> 40
    # 096 -> 60
    # 128 -> 80
    # 160 -> A0
    # 192 -> C0
    # 224 -> E0

    # Variations are 0 thru 7 (could not find one with more but this is safe up
    # to 9, i.e. an item with 10 variations is safe)
    # 0 160 -> A0 + 0 = A0
    # 000000 A0 0000 CODE
    # 0 128 -> 80 + 1 = 80
    # 000000 80 0000 CODE
    # 1 0 -> 0 + 1 = 01
    # 000000 01 0000 CODE
    # 1 128 -> 80 + 1 = 81
    # 000000 81 0000 CODE
    # 1 160 -> A0 + 1 = A1
    # 000000 A1 0000 CODE

    # 070B 0 160
    # 000000 A0 0000 070B

    # Just do hex addition and pad it.
    return f"000000{pattern + variantion:02X}0000{item_id}"


if __name__ == "__main__":

    data_folder = Path("./data")
    output_dir = Path("./processed_data")
    output_dir.mkdir(exist_ok=True)

    csv_files = data_folder.glob("*.csv")

    dfs = {}
    for file in data_folder.glob("*.csv"):
        dfs[file.stem] = pd.read_csv(file)

    for df in dfs.values():
        add_hex_id_col(df)
        add_variation_pattern_col(df)

    for name, df in dfs.items():
        df.to_csv(output_dir / f"{name}.csv", index=False)
