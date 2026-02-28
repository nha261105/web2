type MyFrameType = {
  txt: string;
  onHandle: () => void;
};

type MyFrameWithInfoType = {
  title: string;
  txts: string[];
};

function MyFrameWithTextButton({ txt, onHandle }: MyFrameType) {
  return (
    <button className="w-full py-5 flex flex-col justify-center items-center gap-3 border-2 border-yellow-100 rounded-lg bg-yellow-50">
      <div className="text-sm">{txt}</div>
      <div
        className="text-sm px-7 py-2 flex flex-row justify-center items-center rounded-sm bg-yellow-400 cursor-pointer hover:bg-yellow-500 active:bg-yellow-300 transition-colors"
        onClick={onHandle}
      >
        <div className="font-bold text-blue-800">Pay</div>
        <div className="font-bold text-blue-400">Pal</div>
      </div>
    </button>
  );
}

function MyFrameWithInfo({ title, txts }: MyFrameWithInfoType) {
  return (
    <div className="w-full p-5 flex flex-col bg-gray-100 gap-3 rounded-lg">
      <div className="text-base font-medium">{title}</div>
      <div className="w-full flex flex-col gap-1">
        {txts.map((item, index) => (
          <div className="text-base text-gray-600" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export { MyFrameWithTextButton, MyFrameWithInfo };
