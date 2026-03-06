import { Check } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type MyProcessCheckoutType = {
  items: string[];
  position: number;
};

export default function MyProcessCheckout({
  items,
  position,
}: MyProcessCheckoutType) {
  return (
    <>
      {items.map((item, index) => {
        const num = index + 1;
        if (num < position)
          return (
            <Fragment key={index}>
              <div
                className={`flex justify-center items-center rounded-full w-10 h-10 bg-green-500 text-white font-semibold`}
              >
                <Check size={20} strokeWidth={3} />
              </div>
              <div
                className={`text-base hidden sm:block text-green-500 font-semibold`}
              >
                {item}
              </div>
              <div className="w-20 h-0.5 bg-green-500 rounded-full"></div>
            </Fragment>
          );

        if (index < items.length - 1)
          return (
            <Fragment key={index}>
              <div
                className={`flex justify-center items-center rounded-full w-10 h-10 ${num == position ? "bg-blue-600 text-white" : "bg-gray-300"} font-semibold`}
              >
                {num}
              </div>
              <div
                className={`text-base hidden sm:block ${num == position ? "text-blue-700" : "text-gray-400"} font-semibold`}
              >
                {item}
              </div>
              <div className="w-20 h-0.5 bg-gray-300 rounded-full"></div>
            </Fragment>
          );

        return (
          <Fragment key={index}>
            <div
              className={`flex justify-center items-center rounded-full w-10 h-10 ${num == position ? "bg-blue-600 text-white" : "bg-gray-300"} font-semibold`}
            >
              {num}
            </div>
            <div
              className={`text-base hidden sm:block ${num == position ? "text-blue-700" : "text-gray-400"} font-semibold`}
            >
              {item}
            </div>
          </Fragment>
        );
      })}
    </>
  );
}
