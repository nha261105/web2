import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type MyNumericInputType = {
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
};

export default function MyNumericInput({
  min = 1,
  max = 100,
  defaultValue = 1,
  value,
  onChange,
}: MyNumericInputType) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = value ?? internalValue;

  const updateValue = (nextValue: number) => {
    const normalized = Math.min(Math.max(nextValue, min), max);
    if (value === undefined) {
      setInternalValue(normalized);
    }
    onChange?.(normalized);
  };

  const dec = () => {
    updateValue(currentValue - 1);
  };
  const inc = () => {
    updateValue(currentValue + 1);
  };
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (Number.isNaN(val)) {
      return;
    }
    updateValue(val);
  };

  return (
    <div className="flex flex-row h-6 items-center rounded-sm border w-fit overflow-hidden">
      <button
        onClick={dec}
        disabled={value == min}
        className="flex justify-center items-center cursor-pointer w-6 h-full hover:bg-gray-100 border-r"
      >
        <Minus size={10} className="text-sm text-gray-500" />
      </button>
      <input
        type="number"
        value={value}
        onChange={handleChangeInput}
        className="
                w-15 text-sm text-center outline-none
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
            "
      />
      <button
        onClick={inc}
        disabled={value == max}
        className="flex justify-center items-center cursor-pointer w-6 h-full hover:bg-gray-100 border-l"
      >
        <Plus size={10} className="text-sm text-gray-500" />
      </button>
    </div>
  );
}
