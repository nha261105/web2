type MyInputCheckboxType = {
  htmlFor: string;
  text?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function MyInputCheckbox({
  htmlFor,
  text,
  checked,
  onChange,
}: MyInputCheckboxType) {
  return (
    <div className="flex flex-row gap-1 items-center">
      <input
        type="checkbox"
        name={htmlFor}
        id={htmlFor}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {text && (
        <label className="text-sm cursor-pointer" htmlFor={htmlFor}>
          {text}
        </label>
      )}
    </div>
  );
}

export { MyInputCheckbox };
