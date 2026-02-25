import { useNavigate } from "react-router-dom"

type MyHrefType = {
    text: string
    src: string
}

export default function MyHref({text, src}: MyHrefType) {
    const navigate = useNavigate();

    return <div className="flex flex-row justify-center items-center gap-1 text-blue-700 hover:underline cursor-pointer" 
                onClick={() => { navigate(src); }}>
        <div className="text-sm">{text}</div>
    </div>
}