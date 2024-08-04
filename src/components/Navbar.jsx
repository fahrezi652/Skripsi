"use client"
import { useState } from "react"
import { signOut } from "next-auth/react"
export default function Navbar({dashboard, map, data}){
    const [isSidebar, setIsSidebar] = useState(false)
    return(
        <nav className={"relative p-5 flex justify-between items-center gap-5 bg-[#4AFF92] font-bold px-20"}>
            {
                dashboard &&
                <button className="w-5 flex flex-col gap-1 z-50" onClick={() => setIsSidebar(!isSidebar)}>
                    <div className="min-w-5 min-h-[2px] bg-slate-600"></div>
                    <div className="min-w-5 min-h-[2px] bg-slate-600"></div>
                    <div className="min-w-5 min-h-[2px] bg-slate-600"></div>
                </button>
            }
            {
                (map || data) &&
                (
                    <button className="top-10 left-5 absolute" onClick={() => window.history.back()}>
                        <img className="w-5 h-5" src="back-button.png" alt="Back Button" />
                    </button>
                )
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
                        className="group relative w-full bg-white hover:bg-black hover:text-white py-1 rounded-xl text-center"
                        href="/dashboard/map"
                    >
                        <div className="absolute left-3 top-2 flex flex-col gap-1 w-fit">
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                        </div>
                        Map
                    </a>
                    <a
                        className="group relative w-full bg-white hover:bg-black hover:text-white py-1 rounded-xl text-center"
                        href="/dashboard/data"
                    >
                        <div className="absolute left-3 top-2 flex flex-col gap-1 w-fit">
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                        </div>
                        Database
                    </a>
                    <button
                        className="group relative w-full bg-white hover:bg-black hover:text-white py-1 rounded-xl text-center"
                        onClick={() => window.history.back()}
                    >
                        <div className="absolute left-3 top-2 flex flex-col gap-1 w-fit">
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                            <div className="min-w-5 min-h-[2px] bg-black group-hover:bg-white"></div>
                        </div>
                        Back
                    </button>
                </div>
                <button
                    className="w-full bg-[#00840D] text-white py-1 rounded-xl mb-10 "
                    onClick={() =>  signOut(``)}
                >
                    
                    Logout
                </button>
            </div>
            <a href={dashboard ? "/dashboard/map" : "/"}>
                <img className="w-[150px] h-auto" src="/logo.png" alt="Logo" />
            </a>

            { !dashboard &&
                <div className="flex gap-24 text-[#00840D]">
                    <a href="/">Home</a>
                    <a href="/map">Map</a>
                    <a href="/data">Data</a>
                </div>
            }
        </nav>
    )
}