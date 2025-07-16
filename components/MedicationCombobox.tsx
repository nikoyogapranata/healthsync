// components/MedicationCombobox.tsx

"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Medication {
  medication_id: string;
  name: string;
  dosage: string | null;
  form: string | null;
}

interface MedicationComboboxProps {
  medications: Medication[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function MedicationCombobox({ medications, selectedId, onSelect }: MedicationComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedMedication = medications.find(
    (med) => med.medication_id === selectedId
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedMedication
            ? `${selectedMedication.name} (${selectedMedication.dosage}, ${selectedMedication.form})`
            : "Select medication..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search medication..." />
          <CommandList>
            <CommandEmpty>No medication found.</CommandEmpty>
            <CommandGroup>
              {medications.map((med) => (
                <CommandItem
                  key={med.medication_id}
                  value={med.name}
                  onSelect={() => {
                    onSelect(med.medication_id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === med.medication_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{med.name}</p>
                    <p className="text-xs text-muted-foreground">{med.dosage}, {med.form}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}