"use client";
import "leaflet/dist/leaflet.css";
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Loader from "@/components/Loader";
import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import { Dropdown } from "flowbite-react";
export default function Map(){
    const RestoType = ["Cafe", "Resto"]
    const [loading, setLoading] = useState(true);
    const [geolocs, setGeolocs] = useState([]);
    const [type, setType] = useState("");
    const [calculations, setCalculations] = useState({
        mean: 0,
        std: 0,
        n: 0,
        upper: 0,
        lower: 0,
    });

    const mean = (data, calc) => {
        let count = 0;
        let sum = 0;
        data.forEach((elem) => {
            if (elem._count.geodatas != 0) {
                count += 1; 
                sum += elem._count.geodatas; 
            }
        });
        if (count != 0) {
            calc.count = count;
            calc.mean = sum / count;
        } else {
            calc.count = 0;
            calc.mean = 0;
        }
    };

    const std = (
        data,
        calc
    ) => {
        if (calc.count <= 1) {
            calc.std = 0;
        }
        let sum = 0;
        data.forEach((elem) => {
            if (elem._count.geodatas != 0) {
                sum += Math.pow(elem._count.geodatas - calc.mean, 2);
            }
        });
        if (calc.count != 0) {
            calc.std = Math.sqrt(sum / (calc.count - 1));
        }
    };

    const assignColor = (
        data,
        calc
    ) => {
        const result = data.map((elem) => {
            if (elem._count.geodatas != 0) {
                if (elem._count.geodatas > calc.upper.val) {
                    calc.upper.exist = true;
                    elem.color = "green";
                    return elem;
                }
                if (elem._count.geodatas < calc.lower.val) {
                    calc.lower.exist = true;
                    elem.color = "red";
                    return elem;
                }
                if (
                    elem._count.geodatas >= calc.lower.val &&
                    elem._count.geodatas <= calc.upper.val
                ) {
                    elem.color = "yellow";
                    return elem;
                }
            }
            return elem;
        });
        return result;
    };

    const calculate = (data) => {
        if (data.length == 0) {
            return data;
        }
        let calc_var = {
            count: 0,
            mean: 0,
            std: 0,
            n: 0.4,
            upper: { val: 0, exist: false },
            lower: { val: 0, exist: false },
        };
        mean(data, calc_var);
        if (calc_var.count == 0) {
            return data;
        }
        std(data, calc_var);
        let tries = 0;
        let temp = data;
        while ((!calc_var.upper.exist || !calc_var.lower.exist) && tries != 8) {
            console.log(calc_var.n);
            console.log(calc_var.upper.val);
            calc_var.upper.val = calc_var.mean + calc_var.n * calc_var.std;
            calc_var.lower.val = calc_var.mean - calc_var.n * calc_var.std;
            temp = assignColor(data, calc_var);
            if (!calc_var.upper.exist || !calc_var.lower.exist) {
                calc_var.n -= 0.1;
            }
            tries += 1;
        }
        setCalculations({
            mean: Number(calc_var.mean.toFixed(3)),
            std: Number(calc_var.std.toFixed(3)),
            n: Number(calc_var.n.toFixed(3)),
            upper: Number(calc_var.upper.val.toFixed(3)),
            lower: Number(calc_var.lower.val.toFixed(3)),
        });
        console.log(
            calc_var.mean +
            " " +
            calc_var.std +
            " " +
            calc_var.upper.val +
            " " +
            calc_var.lower.val +
            " "
        );
        const result = temp;
        return result;
    };

    const geolocsAPI = async () => {
        const res = await fetch(
            "/api/geoloc?" +
            new URLSearchParams({
                type: type,
            }),
            {
                method: "GET",
            }
        );
        const { data } = await res.json();
        const result = calculate(data);
        setGeolocs(result);
        setLoading(false);
    };

    useEffect(() => {
        setLoading(true);
        geolocsAPI();
    }, [type]);

    return(
        <>
            <Navbar />
            <main className="relative w-full min-h-[calc(100vh-40px-93px)]">
            {loading ? <Loader /> : null}
            <MapContainer
                center={[-6.9004894, 107.6298902]}
                zoom={9}
                scrollWheelZoom={true}
                className="w-full min-h-[calc(100vh-40px-93px)]"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MarkerClusterGroup chunkedLoading>
                    {geolocs.map((data, index) =>
                        data.geodatas?.map((item, idx) => (
                            <Marker
                                key={JSON.stringify(item)}
                                position={[item.latitude, item.longitude]}
                                icon={
                                    new L.Icon({
                                        iconUrl: MarkerIcon.src,
                                        iconRetinaUrl: MarkerIcon.src,
                                        iconSize: [25, 41],
                                        iconAnchor: [12.5, 41],
                                        popupAnchor: [0, -41],
                                        // shadowUrl: MarkerShadow.src,
                                        // shadowSize: [41, 41],
                                    })
                                }
                            >
                                <Popup>
                                    <div className="max-w-[240px]">
                                        {item.title} <br />
                                        Cafe/Restaurant
                                        <br />
                                        {item.rating}
                                        <br />
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    )}
                </MarkerClusterGroup>

                {geolocs?.map((item) => {
                    const percent = Math.floor(Math.random() * (80 - 20 + 1) + 20);
                    return (
                        <GeoJSON
                            key={JSON.stringify(item)}
                            data={item.geojs}
                            pointToLayer={function (geoJsonPoint, latlng) {
                                return L.marker(latlng, {
                                    icon: new L.Icon({
                                        iconUrl: MarkerIcon.src,
                                        iconRetinaUrl: MarkerIcon.src,
                                        iconSize: [25, 41],
                                        iconAnchor: [12.5, 41],
                                        popupAnchor: [0, -41],
                                    }),
                                });
                            }}

                            onEachFeature={function (feature, layer) {
                                let sumstr = "";

                                // Mengecek apakah item.name adalah string
                                if (typeof item.name === 'string') {
                                    // Mengonversi string ke dalam bentuk array dan melakukan iterasi
                                    item.name.split(',').forEach((elem) => {
                                        sumstr += elem + ": <br />";
                                    });
                                }
                                item.geodatas.slice(0,5).map((data, index) => {
                                    sumstr += `<a target="_blank" href="${data.maps_link}">${index+1} ${data.title}</a><br />`
                                })
                                // sumstr += String(item._count.geodatas);
                                const popUpContent = `<Popup>${sumstr}</Popup>`;
                                layer.bindPopup(popUpContent);
                            }}
                            pathOptions={{
                                fillColor: item.color != undefined ? item.color : "blue",
                                fillOpacity: 0.4,
                                weight: 1,
                                opacity: 1,
                                color: "black",
                            }}
                        />
                    );
                })}

            </MapContainer>
            <div className="fixed top-28 z-[999999] flex items-start w-fit">
                <div>
                    <Card className="max-w-sm mt-30 fixed top-15 right-0 z-1200 rounded-none">
                        <div className="flex items-center justify-between">
                            <h6 className="text-sm font-bold leading-none text-gray-900 dark:text-white">
                                Keterangan Peta {type == "" ? "Cafe/Resto" : ""}
                            </h6>
                        </div>
                        <div className="flow-root">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                <li className="py-1 sm:py-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                Jumlah {type == "" ? "Cafe/Resto" : ""} Tertinggi
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <div className="w-3 h-3 mx-2 bg-green-500"></div>{" "}
                                            {/* Hijau */}
                                        </div>
                                    </div>
                                </li>
                                <li className="py-1 sm:py-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                Jumlah {type == "" ? "Cafe/Resto" : ""} Sedang{" "}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <div className="w-3 h-3 mx-2 bg-yellow-300"></div>{" "}
                                            {/* Kuning */}
                                        </div>
                                    </div>
                                </li>
                                <li className="py-1 sm:py-2">
                                    <div className="flex items-center space-x-4">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                                                Jumlah {type == "" ? "Cafe/Resto" : ""} Terendah{" "}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                                            <div className="w-3 h-3 mx-2 bg-red-500"></div>{" "}
                                            {/* Merah */}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div className="justify-self-end">
                                <Dropdown label={type == "" ? "Cafe/Resto" : type} style={{ backgroundColor: "black", color: "white" }} dismissOnClick={false}>
                                    <Dropdown.Item onClick={() => setType("")}>
                                        Cafe/Resto
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => setType("Cafe")}>
                                        Cafe
                                    </Dropdown.Item>
                                    <Dropdown.Item  onClick={() => setType("Resto")}>
                                        Resto
                                    </Dropdown.Item>
                                </Dropdown>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            </main>
            <Footer />
        </>
    )
}