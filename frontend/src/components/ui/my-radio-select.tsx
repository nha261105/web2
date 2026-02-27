type MyRadioSelectType = {
  className: string;
  title: string;
  text: string;
  name: string;
  selectedOption: string;
  value: string;
  onChange: (value: string) => void;
};

export default function MyRadioSelect({
  className,
  title,
  text,
  name,
  value,
  selectedOption,
  onChange,
}: MyRadioSelectType) {
  return (
    <div
      className={`${className} flex border-2 rounded-sm px-3 py-2 cursor-pointer items-start gap-2 ${selectedOption === value ? "border-blue-600" : "hover:border-gray-300"}`}
      onClick={() => {
        onChange(value);
      }}
    >
      <input
        type="radio"
        name={`${name}`}
        checked={selectedOption === value}
        className="mt-0.5 cursor-pointer"
        onChange={() => onChange(value)}
      />
      <div className="flex flex-col gap-1">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{text}</div>
      </div>
    </div>
  );
}
