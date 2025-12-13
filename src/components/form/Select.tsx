import { useState } from "react";

interface Option {
  value: number | string;
  label: string;
  disabled?: boolean;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

type OptionOrGroup = Option | OptionGroup;

interface SelectProps {
  options: OptionOrGroup[];
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  value,
  onChange,
  onBlur,
  className = "",
  defaultValue = "",
  ...props
}) => {
  // Use controlled value if provided, otherwise use internal state
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange(newValue); // Trigger parent handler
  };

  return (
    <div className="relative">
      <select
      {...props}
        className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
          selectedValue
            ? "text-gray-800 dark:text-white/90"
            : "text-gray-400 dark:text-gray-400"
        } ${className}`}
        value={selectedValue}
        onChange={handleChange}
        onBlur={onBlur}
      >
        {/* Placeholder option */}
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
        {/* Map over options and support optgroup objects */}
        {options.map((opt, idx) => {
          // detect group by presence of 'options' property
          if ((opt as OptionGroup).options) {
            const group = opt as OptionGroup;
            return (
              <optgroup key={`group-${idx}-${group.label}`} label={group.label}>
                {group.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    className={`text-gray-700 dark:bg-gray-900 dark:text-gray-400 ${option.disabled ? 'opacity-50' : ''}`}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            );
          }

          const option = opt as Option;
          return (
            <option
              key={(option && option.value) || `opt-${idx}`}
              value={option.value}
              disabled={option.disabled}
              className={`text-gray-700 dark:bg-gray-900 dark:text-gray-400 ${option.disabled ? 'opacity-50' : ''}`}
            >
              {option.label}
            </option>
          );
        })}
      </select>
      {/* Dropdown icon */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default Select;
