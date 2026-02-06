import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export function Disclaimer() {
  return (
    <div className="flex items-center justify-center">
      <Alert className="border-red-700 bg-red-300 dark:border-amber-900 dark:bg-red-950 text-black dark:text-white">
        <InfoIcon />
        <AlertTitle>Stick Items Disclaimer</AlertTitle>
        <AlertDescription className="text-black dark:text-white">
          If you can&apos;t pick up the item in the game it&apos;s best NOT to
          request it from the Bot. These items will be stuck in your inventory
          and you will never be able to get rid of it. I filtered out many of
          the items that do this but be cautious.
        </AlertDescription>
      </Alert>
    </div>
  );
}
