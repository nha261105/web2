import { Eye, EyeClosed, Lock, type LucideIcon } from "lucide-react";
import { useState } from "react";

type MyInputTextType = {
  defaultValue: string;
  placeholder: string;
  className?: string;
};

type MyInputForTextType = {
  className?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  title: string;
  htmlFor: string;
};

type MyInputForTextIcon = {
  icon?: LucideIcon;
  className: string;
  defaultValue: string;
  placeholder: string;
  title: string;
  htmlFor: string;
  onChange?: (value: string) => void;
};

function MyInputText({
  defaultValue,
  placeholder,
  className,
}: MyInputTextType) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div
      className={`${className ? className : ""} flex flex-1 items-center gap-2`}
    >
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
  className = "",
  defaultValue = "",
  value,
  onChange,
  placeholder,
  title,
  htmlFor,
}: MyInputForTextType) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <label htmlFor={`${htmlFor}`} className="text-sm font-semibold w-fit">
        {title}
      </label>
      <div className="flex w-full items-center">
        <input
          type="text"
          value={isControlled ? value : internalValue}
          id={htmlFor}
          onChange={(e) => {
            if (!isControlled) setInternalValue(e.target.value);
            if (onChange) onChange(e);
          }}
          placeholder={placeholder}
          className={`w-full rounded-lg outline py-2 px-3 text-sm 
                        outline-gray-400
                        focus:outline-2 focus:outline-blue-500 
                        transition-colors`}
        />
      </div>
    </div>
  );
}

function MyInputForTextIcon({
  icon: Icon,
  className,
  defaultValue,
  placeholder,
  title,
  htmlFor,
  onChange,
}: MyInputForTextIcon) {
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <label htmlFor={`${htmlFor}`} className="text-sm font-semibold w-fit">
        {title}
      </label>
      <div className="flex flex-row gap-2 w-full items-center rounded-lg px-3 py-2 outline outline-gray-400 focus-within:outline-2 focus-within:outline-blue-500 transition-colors">
        {Icon && <Icon size={18} className="text-gray-400" />}
        <input
          type="text"
          defaultValue={defaultValue}
          id={htmlFor}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`text-sm outline-0 w-full`}
        />
      </div>
    </div>
  );
}

function MyInputForTextPass({
  className,
  defaultValue,
  placeholder,
  title,
  htmlFor,
  onChange,
}: MyInputForTextIcon) {
  const [isClosed, setIsClosed] = useState(true);
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <label htmlFor={`${htmlFor}`} className="text-sm font-semibold w-fit">
        {title}
      </label>
      <div className="flex flex-row gap-2 w-full items-center rounded-lg px-3 py-2 outline outline-gray-400 focus-within:outline-2 focus-within:outline-blue-500 transition-colors">
        <Lock size={18} className="text-gray-400" />
        <input
          type={`${isClosed ? "password" : "text"}`}
          defaultValue={defaultValue}
          id={htmlFor}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={`text-sm outline-0 w-full`}
        />
        {isClosed ? (
          <EyeClosed
            onClick={() => {
              setIsClosed(false);
            }}
            size={18}
            className="text-gray-400 cursor-pointer"
          />
        ) : (
          <Eye
            onClick={() => {
              setIsClosed(true);
            }}
            size={18}
            className="text-gray-400 cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}

export { MyInputText, MyInputForText, MyInputForTextIcon, MyInputForTextPass };
