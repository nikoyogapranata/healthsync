import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DiseaseType = {
  disease_id: string
  name: string
  icd_10_code: string
}

export function DiseaseCombobox({
  diseases,
  selectedId,
  onSelect,
}: {
  diseases: DiseaseType[]
  selectedId: string
  onSelect: (diseaseId: string) => void
}) {
  const [open, setOpen] = useState(false)

  const selectedDisease = diseases.find(
    (disease) => disease.disease_id === selectedId
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selectedDisease
            ? `${selectedDisease.name} (${selectedDisease.icd_10_code})`
            : "Select a diagnosis..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search disease..." />
          <CommandList>
            <CommandEmpty>No disease found.</CommandEmpty>
            <CommandGroup>
              {diseases.map((disease) => (
                <CommandItem
                  key={disease.disease_id}
                  value={disease.name}
                  onSelect={(currentValue) => {
                    const found = diseases.find(
                      (d) => d.name.toLowerCase() === currentValue.toLowerCase()
                    )
                    if (found) {
                      onSelect(found.disease_id)
                    }
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === disease.disease_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {disease.name} ({disease.icd_10_code})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
