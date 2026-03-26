import { ChevronLeft, type LucideIcon } from "lucide-react";
import type { MouseEventHandler } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

type MyButtonType = {
  text: string;
  classname?: string;
  icon?: LucideIcon;
  onClick?: MouseEventHandler<HTMLDivElement>;
  src?: string;
  color?: string;
};

type MyBackButtonType = {
  text: string;
  className: string;
  onHandle: () => void;
};

type MyGoogleButtonType = {
  className: string;
  onHandle: () => void;
};

function MyButton({
  text,
  classname = "",
  icon: Icon,
  onClick,
  src,
  color,
}: MyButtonType) {
  const navigate = useNavigate();
  const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (src) navigate(src);
    if (onClick) onClick(e);
  };
  const colorVariants: Record<string, string> = {
    blue: `
      bg-blue-700 hover:bg-blue-600 active:bg-blue-500
      border-2 border-blue-700 hover:border-blue-600 active:border-blue-500
    `,
    orange: `
      bg-orange-400 hover:bg-orange-500 active:bg-orange-600
      border-2 border-orange-400 hover:border-orange-500 active:border-orange-600
    `,
  };

  return (
    <div
      className={`
            flex justify-center items-center py-2 rounded-lg
            ${color ? colorVariants[color] : colorVariants["blue"]}
            transition-colors cursor-pointer
            ${classname}
        `}
      onClick={handleClick}
    >
      <div className="flex justify-center items-center gap-2">
        <div className="text-white text-sm font-medium">{text}</div>
        {Icon && <Icon size={20} strokeWidth="2.25px" className="text-white" />}
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

function MyBackButton({ text, className, onHandle }: MyBackButtonType) {
  const colorVariants = {
    white: `
      bg-white hover:bg-gray-50 active:bg-gray-100
      border-2
    `,
  };
  return (
    <div
      className={`
            flex justify-center items-center
            py-2 rounded-lg cursor-pointer border-2
            ${colorVariants["white"]}
            transition-colors
            ${className}
        `}
      onClick={onHandle}
    >
      <ChevronLeft className="text-800" size={20} strokeWidth="2.25px" />
      <div className="text-gray-800 text-sm font-medium">{text}</div>
    </div>
  );
}

function MyGoogleButton({ className, onHandle }: MyGoogleButtonType) {
  const colorVariants = {
    white: `
      bg-white hover:bg-gray-50 active:bg-gray-100
      border-2
    `,
  };
  return (
    <div
      className={`
            flex flex-1 justify-center items-center gap-1
            py-2 rounded-lg cursor-pointer border-2
            ${colorVariants["white"]}
            transition-colors
            ${className}
        `}
      onClick={onHandle}
    >
      <img
        src="/google_icon.svg"
        alt="google icon"
        className="w-8 aspect-square"
      />
      <div className="text-gray-800 text-sm font-medium">Google</div>
      <img
        src="/google_icon.svg"
        alt="google icon"
        className="w-8 aspect-square invisible"
      />
    </div>
  );
}
export { MyButton, ButtonIcon, MyBackButton, MyGoogleButton };
