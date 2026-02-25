import type { ReactNode } from "react";

type MyButtonType = {
    text: string,
    classname?: string,
    icon?: ReactNode
};

export default function MyButton({text, classname = "", icon}: MyButtonType){
    return <div className={`
            flex justify-center items-center 
            h-10 px-4 rounded-lg 
            bg-blue-700
            hover:bg-blue-600 transition-colors cursor-pointer 
            active:bg-blue-500
            ${classname}
        `}>
            <div className="flex justify-center items-center gap-2">
                <div className="text-white text-sm font-medium">{text}</div>
                {icon && <div className="">{icon}</div>}
            </div>
    </div>
}