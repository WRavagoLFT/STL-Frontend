import React from "react";
import Select, { SingleValue, ActionMeta } from "react-select";

type OptionType = {
  label: string;
  value: string;
};

type QuarterSelectorProps = {
  quarterValue: OptionType | null;
  yearValue: OptionType | null;
  onChangeQuarter: (option: OptionType | null) => void;
  onChangeYear: (option: OptionType | null) => void;
};

const quarters: OptionType[] = [
  { label: "Q1", value: "Q1" },
  { label: "Q2", value: "Q2" },
  { label: "Q3", value: "Q3" },
  { label: "Q4", value: "Q4" },
];

const currentYear = new Date().getFullYear();
const years: OptionType[] = Array.from({ length: 10 }, (_, i) => {
  const year = (currentYear - i).toString();
  return { label: year, value: year };
});

const customStyles = {
  control: (provided: any) => ({
    ...provided,
    borderColor: "#0038A8",
    fontSize: "0.875rem",
    padding: "2px",
  }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

const QuarterSelector: React.FC<QuarterSelectorProps> = ({
  quarterValue,
  yearValue,
  onChangeQuarter,
  onChangeYear,
}) => {
  const handleQuarterChange = (
    selected: SingleValue<OptionType>,
    _actionMeta: ActionMeta<OptionType>
  ) => {
    onChangeQuarter(selected);
  };

  const handleYearChange = (
    selected: SingleValue<OptionType>,
    _actionMeta: ActionMeta<OptionType>
  ) => {
    onChangeYear(selected);
  };

  return (
    <div className="flex gap-4">
      <div className="w-full">
        <label htmlFor="quarter" className="block text-sm mb-1">
          Quarter
        </label>
        <Select
          inputId="quarter"
          value={quarterValue}
          onChange={handleQuarterChange}
          options={quarters}
          styles={customStyles}
          classNamePrefix="react-select"
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          placeholder="Select Quarter"
        />
      </div>
      <div className="w-full">
        <label htmlFor="year" className="block text-sm mb-1">
          Year
        </label>
        <Select
          inputId="year"
          value={yearValue}
          onChange={handleYearChange}
          options={years}
          styles={customStyles}
          classNamePrefix="react-select"
          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
          placeholder="Select Year"
        />
      </div>
    </div>
  );
};

export default QuarterSelector;
