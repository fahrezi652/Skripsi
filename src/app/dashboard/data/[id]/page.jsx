"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Loader from "@/components/Loader";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
export default function DataId({params}){
    const [data, setData] = useState({})
    const [loading, setLoading] = useState(true)
    const {status} = useSession()
    useEffect(() => {
        if(status == "unauthenticated"){
            redirect("/")
        }
    }, [status])
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/geodata/id?id="+params.id)
            const jsonData = await res.json()
            setData(jsonData.data)
            setLoading(false)
        }
        fetchData()
    },[])

        if (!loading) {
          return (
            <>
                <Navbar dashboard />
                <main className="relative p-5 px-20 flex justify-center items-center gap-32 bg-[#f5f5f5] min-h-[calc(100vh-40px-93px)]">
                    <img className="w-5/12 aspect-auto rounded-xl" src={data.photo_url || "/illustration.png"} alt="" />
                    <div
                        className="w-5/12 bg-[#4AFF92] p-5 rounded-lg"
                    >
                        <h1 className="font-bold font-koh text-xl text-center">{data.title}</h1>
                        <table className="w-full mt-5">
                            <tr>
                                <td>Kabupaten/Kota</td>
                                <td>: {data.Kab_kota}</td>
                            </tr>
                            <tr>
                                <td className=" align-top">Jam Buka</td>
                                <td>
                                    <ul>
                                    {
                                        data.opening_hours.split(",").length > 0 ?
                                        data.opening_hours.split(",").map((d, i) => <li key={"hour"+i}>{d}</li>) 
                                        :
                                        "Opening hours not available"
                                    }
                                    </ul>
                                </td>
                            </tr>
                            <tr>
                                <td>Rating</td>
                                <td>: {data.rating}</td>
                            </tr>
                            <tr>
                                <td>Review</td>
                                <td>: {data.reviews}</td>
                            </tr>
                            <tr>
                                <td>Map</td>
                                <td>: <a href={data.maps_link} target="_blank">Klik Disini</a></td>
                            </tr>
                        </table>
                    </div>
                </main>
                <Footer />
            </>
          );
        }
    
      return (
        <>
            <Navbar dashboard />
            <main className="relative p-5 px-20 flex flex-col justify-between items-end gap-5 bg-[#f5f5f5] min-h-[calc(100vh-40px-93px)]">
                <Loader />
            </main>
            <Footer />
        </>
      );
}