import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Badge } from "./badge";
import { createTag, getTags } from "@/lib/posts";

interface Tag {
  id: number;
  name: string;
  created_at?: string;
}

interface MultiSelectProps {
  id?: string;
  value: Tag[];
  onValueChange: (value: Tag[]) => void;
  options: Tag[];
  placeholder?: string;
  className?: string;
  creatable?: boolean;
  onSearch?: (query: string) => void;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      id,
      value = [],
      onValueChange,
      options,
      placeholder = "Select items...",
      className,
      creatable = false,
      onSearch,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleAddItem = async (item: string | Tag) => {
      if (typeof item === "string") {
        if (item && !value.some((tag) => tag.name === item)) {
          // const newTag = { id: Date.now(), name: item };
          const newTag = await createTag(item);
          onValueChange([...value, newTag]);
        }
      } else {
        if (item && !value.some((tag) => tag.id === item.id)) {
          onValueChange([...value, item]);
        }
      }
      setInputValue("");
      // setIsOpen(false);
    };

    const handleRemoveItem = (itemToRemove: Tag) => {
      onValueChange(value.filter((item) => item.id !== itemToRemove.id));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue.trim()) {
        e.preventDefault();
        if (creatable) {
          handleAddItem(inputValue.trim());
        }
      } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
        // Remove the last item when backspace is pressed and input is empty
        handleRemoveItem(value[value.length - 1]);
      } else if (onSearch) {
        onSearch(inputValue);
      }
    };

    const filteredOptions = options.filter(
      (option) =>
        !value.some((selected) => selected.id === option.id) &&
        option.name.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <div className={cn("relative w-full", className)} ref={ref} {...props}>
        <div
          className={cn(
            "flex flex-wrap gap-2 w-full rounded-md border border-input bg-slate-700/50 px-3 py-2 text-sm ring-offset-background",
            "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 border-purple-700/50",
            "min-h-10"
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {value.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="flex items-center gap-1.5 bg-background border-purple-700/50 text-white"
            >
              {item.name}
              <button
                type="button"
                className="ml-1.5 h-4 w-4 rounded-full flex items-center justify-center hover:bg-slate-600/50"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item);
                }}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 bg-transparent outline-none min-w-[100px] text-sm"
          />
        </div>

        {isOpen &&
          (filteredOptions.length > 0 || (creatable && inputValue)) && (
            <div className="absolute z-10 mt-1 w-full rounded-md border bg-slate-700 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
              <div className="p-1 max-h-48 overflow-auto">
                {filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAddItem(option);
                    }}
                  >
                    {option.name}
                  </div>
                ))}
                {creatable &&
                  inputValue &&
                  !options.some((opt) => opt.name === inputValue) && (
                    <div
                      className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAddItem(inputValue);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create "{inputValue}"
                    </div>
                  )}
              </div>
            </div>
          )}
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect };
