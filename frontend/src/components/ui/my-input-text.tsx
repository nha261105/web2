import { useState } from "react"

type MyInputTextType = {
    defaultValue: string,
    placeholder: string,
};

export default function MyInputText({ defaultValue, placeholder }: MyInputTextType) {
    const [value, setValue] = useState(defaultValue);

    return <div className="flex flex-1 items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 rounded-lg outline px-3 text-sm
                outline-gray-400
                focus:outline-2 focus:outline-blue-500 
                transition-colors"
        />
    </div>
}