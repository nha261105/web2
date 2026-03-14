import { useNavigate } from "react-router-dom";

type MyHrefType = {
  text: string;
  src: string;
  className?: string;
};

export default function MyHref({ text, src, className }: MyHrefType) {
  const navigate = useNavigate();

  return (
    <div
      className={`${className} flex flex-row justify-center items-center gap-1 text-blue-700 hover:underline cursor-pointer font-semibold`}
      onClick={() => {
        navigate(src);
      }}
    >
      <div className="text-sm">{text}</div>
    </div>
  );
}
