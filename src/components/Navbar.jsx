"use client"
import { useState } from "react"
import { signOut } from "next-auth/react"
export default function Navbar({dashboard}){
    const [isSidebar, setIsSidebar] = useState(false)
    return(
        <nav className="relative p-5 flex justify-between items-center gap-5 bg-[#4AFF92] font-bold px-20">
            {
                dashboard &&
                <button className="w-5 absolute flex flex-col gap-1 left-5" onClick={() => setIsSidebar(!isSidebar)}>
                    <div className="min-w-5 min-h-[2px] bg-slate-600"></div>
                    <div className="min-w-5 min-h-[2px] bg-slate-600"></div>
                    <div className="min-w-5 min-h-[2px] bg-slate-600"></div>
                </button>
            }
            <div
                className={`absolute px-10 top-0 ${isSidebar ?  "left-0" : "left-[-300px]"} transition-all duration-500 min-h-[100vh] z-[99999] w-[300px] bg-[#4AFF92] flex flex-col justify-between`}
            >
                <button
                    className="absolute top-5 right-5 text-2xl"
                    onClick={() => setIsSidebar(!isSidebar)}
                >
                    X
                </button>
                <div
                    className="mt-[100px] flex flex-col gap-10"
                >
                    <a
                        className="relative w-full bg-white py-1 rounded-xl text-center"
                        href="/dashboard/map"
                    >
                        <div className="absolute left-3 top-2 flex flex-col gap-1 w-fit">
                            <div className="min-w-5 min-h-[2px] bg-black"></div>
                            <div className="min-w-5 min-h-[2px] bg-black"></div>
                            <div className="min-w-5 min-h-[2px] bg-black"></div>
                        </div>
                        Map
                    </a>
                    <a
                        className="relative w-full bg-black text-white py-1 rounded-xl text-center"
                        href="/dashboard/data"
                    >
                        <div className="absolute left-3 top-2 flex flex-col gap-1 w-fit">
                            <div className="min-w-5 min-h-[2px] bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-white"></div>
                        </div>
                        Data
                    </a>
                </div>
                <button
                    className="w-full bg-[#00840D] text-white py-1 rounded-xl mb-10 "
                    onClick={() =>  signOut(``)}
                >
                    
                    Logout
                </button>
            </div>
            <a href="/">
                <img className="w-[150px] h-auto" src="/logo.png" alt="Logo" />
            </a>

            <div className="flex gap-24 text-[#00840D]">
            <a href="/">Home</a>
            <a href="/map">Map</a>
            <a href="/data">Data</a>
            </div>
        </nav>
    )
}