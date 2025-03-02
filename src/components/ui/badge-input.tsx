import React, { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface BadgeInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  suggestions?: string[];
}

const BadgeInput = ({
  value = [],
  onChange,
  placeholder = "Add a tag...",
  className = "",
  suggestions = [],
}: BadgeInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (newValue.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.toLowerCase().includes(newValue.toLowerCase()) &&
          !value.includes(suggestion),
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !value.includes(trimmedTag)) {
      onChange([...value, trimmedTag]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
  };

  return (
    <div className={`border rounded-md p-2 flex flex-wrap gap-2 ${className}`}>
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="flex items-center gap-1"
        >
          {tag}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => removeTag(tag)}
          />
        </Badge>
      ))}
      <div className="relative flex-1 min-w-[120px]">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            inputValue.trim() &&
            suggestions.length > 0 &&
            setShowSuggestions(true)
          }
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={value.length === 0 ? placeholder : ""}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8 p-0"
        />
        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-md z-10 max-h-[200px] overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                onMouseDown={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeInput;
