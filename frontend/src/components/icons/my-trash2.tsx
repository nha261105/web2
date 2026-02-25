import { Trash2 } from "lucide-react";

type MyTrash2Type = {
    size: number
};

export default function MyTrash2 ({size}: MyTrash2Type) {
    return <Trash2 size={size} className="
        text-gray-400 hover:cursor-pointer 
        hover:text-red-500
        active:text-red-400"
    />
}