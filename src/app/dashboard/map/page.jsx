"use client";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import dynamic from 'next/dynamic'
const MapComp = dynamic(() => import('@/components/MapComponent'), { ssr: false });
export default function Map(){


    return(
        <>
            <Navbar dashboard />
            <MapComp />
            <Footer />
        </>
    )
}