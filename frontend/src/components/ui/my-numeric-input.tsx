import { Minus, Plus } from "lucide-react";
import { useState } from "react";

type MyNumericInputType = {
    min?: number,
    max?: number,
    defaultValue?: number,
};

export default function MyNumericInput({
    min = 1,
    max = 100,
    defaultValue = 1,
}: MyNumericInputType){
    const [value, setValue] = useState(defaultValue);
    const dec = () => { setValue(Math.max(min, value - 1)); }
    const inc = () => { setValue(Math.min(value + 1, max)); }
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = Number(e.target.value);
        if(val <= min) setValue(min);
        else if(val >= max) setValue(max);
        else setValue(val);
    }

    return <div className="flex flex-row h-6 items-center rounded-sm border-1 w-fit overflow-hidden">
        <button
            onClick={dec}
            disabled={value==min}
            className="flex justify-center items-center cursor-pointer w-6 h-full hover:bg-gray-100 border-r"
        >
            <Minus size={10} className="text-sm text-gray-500"/>
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
            disabled={value==max}
            className="flex justify-center items-center cursor-pointer w-6 h-full hover:bg-gray-100 border-l"
        >
            <Plus size={10} className="text-sm text-gray-500"/>
        </button>
    </div>
}