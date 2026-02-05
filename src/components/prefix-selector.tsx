import { useState, useEffect } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

export function PrefixSelector({ onPrefixChange }) {
  const [selection, setSelection] = useState("$");
  const [customValue, setCustomValue] = useState("");

  const prefixes = ["$", "%", "#"];

  useEffect(() => {
    const effectivePrefix = selection === "custom" ? customValue : selection;
    onPrefixChange(effectivePrefix);
  }, [selection, customValue, onPrefixChange]);

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-muted-foreground">Prefix:</span>

      <RadioGroup
        defaultValue="$"
        onValueChange={setSelection}
        className="flex flex-row items-center gap-3" // This makes it horizontal
      >
        {["$", "%", "#"].map((sym) => (
          <Field
            key={sym}
            orientation="horizontal"
            className="flex items-center gap-1.5"
          >
            <RadioGroupItem
              value={sym}
              id={`prefix-${sym}`}
            />
            <FieldLabel
              htmlFor={`prefix-${sym}`}
              className="cursor-pointer"
            >
              {sym}
            </FieldLabel>
          </Field>
        ))}

        <Field
          orientation="horizontal"
          className="flex items-center gap-1.5"
        >
          <RadioGroupItem
            value="custom"
            id="prefix-custom"
          />
          <FieldLabel
            htmlFor="prefix-custom"
            className="cursor-pointer"
          >
            Custom
          </FieldLabel>
          {selection === "custom" && (
            <Input
              placeholder="e.g. !"
              className="h-7 w-12 ml-1 px-1 text-center"
              maxLength={3}
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
            />
          )}
        </Field>
      </RadioGroup>
    </div>
  );
}
