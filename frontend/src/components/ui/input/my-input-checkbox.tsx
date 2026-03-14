type MyInputCheckboxType = {
  htmlFor: string;
  text?: string;
};

function MyInputCheckbox({ htmlFor, text }: MyInputCheckboxType) {
  return (
    <div className="flex flex-row gap-1 items-center">
      <input type="checkbox" name={htmlFor} id={htmlFor} />
      {text && (
        <label className="text-sm cursor-pointer" htmlFor={htmlFor}>
          {text}
        </label>
      )}
    </div>
  );
}

export { MyInputCheckbox };
