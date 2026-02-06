export type CSVItem = {
  Name: string;
  "Internal ID": string;
  "Internal ID as hex": string;
  Variation?: string;
  "Body Title"?: string;
  Pattern?: string;
  "Pattern Title"?: string;
  "Variant ID"?: string;
  "Variant Pattern Encoded"?: string;
};

export interface SelectedItem extends CSVItem {
  id: string;
  selectedVariation: string;
  selectedPattern: string;
}
