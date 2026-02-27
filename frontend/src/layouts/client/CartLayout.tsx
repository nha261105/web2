type CartLayoutType = {
    children: React.ReactNode
};

function CartLayout({children}: CartLayoutType) {
    return <div className="w-full bg-gray-50 min-h-screen flex flex-col items-center px-7 pt-6 pb-20">
        <div className="w-full max-w-250 flex flex-col gap-5">
            { children }
        </div>
    </div>
}

function LeftCartLayout({children}: CartLayoutType){
    return <div className="w-full lg:flex-2 flex flex-col gap-3">
        {children}
    </div>
}

function RightCartLayout({children}: CartLayoutType){
    return <div className="flex flex-col flex-1">
        {children}
    </div>
}

export { CartLayout, LeftCartLayout, RightCartLayout }