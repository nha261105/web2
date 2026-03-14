type MyHrefTextType = {
  text: string;
};

function MyHrefText({ text }: MyHrefTextType) {
  return (
    <div className="flex flex-row gap-2 justify-center items-center">
      <div className="flex flex-1 h-0.5 bg-gray-300 rounded-full"></div>
      <div className="flex text-sm text-gray-500">{text}</div>
      <div className="flex flex-1 h-0.5 bg-gray-300 rounded-full"></div>
    </div>
  );
}

export { MyHrefText };
