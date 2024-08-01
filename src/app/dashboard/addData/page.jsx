"use client";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic'
const AddData = dynamic(() => import('@/components/AddData'), { ssr: false });
export default function AddDataPage(){
    const {status} = useSession()
    useEffect(() => {
        if(status == "unauthenticated"){
            redirect("/")
        }
    }, [status])
    
    return(
        <>
            <Navbar dashboard />
            <AddData />
            <Footer />
        </>
    )
}