import { ChevronLeft } from "lucide-react";
import type { MouseEventHandler, ReactNode } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

type MyButtonType = {
  text: string;
  classname?: string;
  icon?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  src?: string;
};

type MyBackButtonType = {
  text: string;
  className: string;
  onHandle: () => void;
};

function MyButton({ text, classname = "", icon, onClick, src }: MyButtonType) {
  const navigate = useNavigate();
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (src) navigate(src);
    if (onClick) onClick(e);
  };

  return (
    <div
      className={`
            flex justify-center items-center 
            py-3 rounded-lg 
            bg-blue-700
            hover:bg-blue-600 transition-colors cursor-pointer 
            active:bg-blue-500
            ${classname}
        `}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center gap-2">
        <div className="text-white text-sm font-medium">{text}</div>
        {icon && <div className="">{icon}</div>}
      </div>
    </div>
  );
}

type ButtonIconType = {
  className: string;
  icon: React.ElementType;
  text: string;
  selectedOption: string;
  value: string;
  onChange: (value: string) => void;
};

function ButtonIcon({
  className,
  icon: Icon,
  text,
  value,
  selectedOption,
  onChange,
}: ButtonIconType) {
  return (
    <div
      className={`${className} flex flex-col border-2 rounded-sm py-5 cursor-pointer items-center gap-2 ${selectedOption === value ? "border-blue-600 bg-blue-50" : "hover:border-gray-300"}`}
      onClick={() => {
        onChange(value);
      }}
    >
      <Icon
        className={`${value === selectedOption ? "text-blue-600" : "text-gray-300"}`}
      />
      <div className="text-sm font-medium text-gray-600">{text}</div>
    </div>
  );
}

function MyBackButton({text, className, onHandle}: MyBackButtonType) {
  return (
    <div
      className={`${className}
            flex justify-center items-center
            py-3 rounded-lg 
            bg-gray-200
            hover:bg-gray-300 transition-colors cursor-pointer 
            active:bg-gray-100
        `}
      onClick={onHandle}
    >
      <ChevronLeft className="text-800"/>
      <div className="text-gray-800 text-sm font-medium">{text}</div>
    </div>
  );
}

export { MyButton, ButtonIcon, MyBackButton };
