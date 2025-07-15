import React from "react";
import Select, { SingleValue, ActionMeta } from "react-select";

export type OptionType = {
  label: string;
  value: string | number; // Allow both
};

type Props = {
  name: string;
  value?: OptionType | null;
  options?: OptionType[];
  onChange?: (e: {
    value: any;
    target: { name: string; value: string };
  }) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
};

const SelectInput: React.FC<Props> = ({
  name,
  value,
  options,
  onChange,
  placeholder,
  error,
  disabled = false,
}) => {
  const handleChange = (
    selectedOption: SingleValue<OptionType>,
    _actionMeta: ActionMeta<OptionType>
  ) => {
    const event = {
      value: selectedOption?.value?.toString() || "",
      target: {
        name,
        value: selectedOption?.value?.toString() || "", // Convert to string
      },
    };
    onChange?.(event);
  };

  return (
    <Select
      inputId={name}
      name={name}
      options={options}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      isDisabled={disabled}
      classNamePrefix="react-select"
      styles={{
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isDisabled
            ? "#A1A1AA"
            : error
              ? "#EF4444 !important"
              : "#0038A8 !important",
          fontSize: "0.875rem",
          minHeight: "35px",
          height: "32px",
          borderRadius: "9px",
          color: state.isDisabled ? "#6B7280" : "inherit",
          backgroundColor: state.isDisabled ? "transparent" : "transparent",
          cursor: state.isDisabled ? "not-allowed" : "default",
          "&:hover": {
            borderColor: state.isDisabled
              ? "#A1A1AA"
              : error
                ? "#EF4444"
                : "#0038A8",
          },
          boxShadow: state.isFocused ? (error ? "none" : "none") : "none",
        }),

        menuPortal: (base) => ({
          ...base,
          zIndex: 1000000,
        }),
        menu: (provided) => ({
          ...provided,
          maxHeight: 400,
          overflowY: "auto",
        }),
      }}
      menuPortalTarget={typeof window !== "undefined" ? document.body : null}
    />
  );
};

export default SelectInput;
