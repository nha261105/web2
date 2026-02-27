import type { MouseEventHandler, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type MyButtonType = {
    text: string,
    classname?: string,
    icon?: ReactNode,
    onClick?: MouseEventHandler<HTMLDivElement>,
    src?: string,
};

export default function MyButton({text, classname = "", icon, onClick, src}: MyButtonType){
    const navigate = useNavigate()
    const handleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        if(src) navigate(src)
        if(onClick) onClick(e)
    }

    return <div className={`
            flex justify-center items-center 
            h-10 px-4 rounded-lg 
            bg-blue-700
            hover:bg-blue-600 transition-colors cursor-pointer 
            active:bg-blue-500
            ${classname}
        `}
            onClick={ handleClick }
        >
            <div className="flex justify-center items-center gap-2">
                <div className="text-white text-sm font-medium">{text}</div>
                {icon && <div className="">{icon}</div>}
            </div>
    </div>
}