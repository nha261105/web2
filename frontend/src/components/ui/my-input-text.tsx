import { useState } from "react";

type MyInputTextType = {
  defaultValue: string;
  placeholder: string;
};

type MyInputForTextType = {
  className: string;
  defaultValue: string;
  placeholder: string;
  title: string;
  htmlFor: string;
};

function MyInputText({ defaultValue, placeholder }: MyInputTextType) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex flex-1 items-center gap-2">
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
  );
}

function MyInputForText({
  className,
  defaultValue,
  placeholder,
  title,
  htmlFor,
}: MyInputForTextType) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <label htmlFor={`${htmlFor}`} className="text-sm font-semibold w-fit">
        {title}
      </label>
      <div className="flex w-full items-center">
        <input
          type="text"
          value={value}
          id={htmlFor}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-10 rounded-lg outline px-3 text-sm 
                        outline-gray-400
                        focus:outline-2 focus:outline-blue-500 
                        transition-colors`}
        />
      </div>
    </div>
  );
}

export { MyInputText, MyInputForText };
