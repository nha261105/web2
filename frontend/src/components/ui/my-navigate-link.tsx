import { Fragment } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";

type MyNavigateLink = {
  items: {
    text: string;
    link?: string;
  }[];
};

export default function MyNavigateLink({ items }: MyNavigateLink) {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-row items-center gap-3">
      {items.map((item, index) => {
        if (index < items.length - 1)
          return (
            <Fragment key={index}>
              <div
                className="text-sm text-gray-500 font-medium hover:text-blue-500 active:text-blue-700 hover:cursor-pointer"
                onClick={() => {
                  if (!item.link) return;
                  navigate(item.link);
                }}
              >
                {item.text}
              </div>
              <div className="text-sm text-gray-500 font-medium">&gt;</div>
            </Fragment>
          );

        return (
          <Fragment key={index}>
            <div className="text-sm text-black font-medium">{item.text}</div>
          </Fragment>
        );
      })}
    </div>
  );
}
