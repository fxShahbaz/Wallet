
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
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

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputClassName?: string;
}

export function Combobox({ options, value, onChange, placeholder, inputClassName }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between font-normal", inputClassName)}
            >
            {value
                ? options.find((option) => option.label.toLowerCase() === value.toLowerCase())?.label || value
                : placeholder || "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Search or add category..."
          />
          <CommandList>
            <CommandEmpty
                onSelect={() => {
                    const inputValue = (document.querySelector('[cmdk-input]') as HTMLInputElement)?.value;
                    onChange(inputValue);
                    setOpen(false);
                }}
            >
                <div className="p-2 text-sm cursor-pointer">
                    Add new category
                </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(currentValue) => {
                    const label = options.find(opt => opt.label.toLowerCase() === currentValue.toLowerCase())?.label || currentValue
                    onChange(label === value ? "" : label)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && value.toLowerCase() === option.label.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
