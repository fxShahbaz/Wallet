
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
  const [inputValue, setInputValue] = React.useState(value)
  const [isCustom, setIsCustom] = React.useState(false);

  React.useEffect(() => {
    setInputValue(value)
    const isExistingOption = options.some(option => option.value.toLowerCase() === value.toLowerCase());
    setIsCustom(!isExistingOption && value !== '');
  }, [value, options]);


  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    onChange(newValue);
    setInputValue(newValue);
    setOpen(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    onChange(text);
    const isExistingOption = options.some(option => option.value.toLowerCase() === text.toLowerCase());
    setIsCustom(!isExistingOption && text !== '');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex w-full items-center relative">
            <input
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                className={cn("w-full pr-8", inputClassName)}
                onClick={() => setOpen(true)}
            />
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 absolute right-2" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Search or add category..." 
            value={inputValue}
            onValueChange={(search) => {
              setInputValue(search);
              onChange(search);
            }}
          />
          <CommandList>
            <CommandEmpty>
                {inputValue && (
                    <CommandItem onSelect={() => handleSelect(inputValue)}>
                       Add "{inputValue}"
                    </CommandItem>
                )}
                {!inputValue && "No category found."}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
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
