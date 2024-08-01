import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import Loader from "@/components/Loader";
import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
export default function AddDara(){
    const center = {
        latitude: -6.9004894, 
        longitude: 107.6298902,
      };
      const [formData, setFormData] = useState({
        latitude: center.latitude,
        longitude: center.longitude,
        title: "",
        prov_id: "",
        maps_link: "",
        Kab_kota: "",
        opening_hours: "",
        photo_url: "",
        type: "Cafe",
        rating: 0,
        reviews: 0
      });
      const [loading, setLoading] = useState(true);
      const markerRef = useRef(null);
      const router = useRouter();
      const DraggableMarker = () => {
        const eventHandlers = useMemo(
          () => ({
            dragend() {
              const marker = markerRef.current;
              if (marker != null) {
                const latlng = marker.getLatLng();
                setFormData({ ...formData, latitude: latlng.lat, longitude: latlng.lng });
              }
            },
          }),
          []
        );
        return (
            <Marker
              draggable={true}
              eventHandlers={eventHandlers}
              position={[formData.latitude, formData.longitude]}
              ref={markerRef}
              icon={
                new L.Icon({
                  iconUrl: MarkerIcon.src,
                  iconRetinaUrl: MarkerIcon.src,
                  iconSize: [25, 41],
                  iconAnchor: [12.5, 41],
                  popupAnchor: [0, -41],
                })
              }
            ></Marker>
          );
        };
        const getMarkerGeoComp = async () => {
            const res = await fetch(
              "/api/geoloc/findarea?" +
                new URLSearchParams({
                  lat: formData.latitude.toString(),
                  lng: formData.longitude.toString(),
                }),
              {
                method: "GET",
              }
            );
            const { data } = await res.json();
            if (data.length != 0) {
              setFormData({
                ...formData,
                prov_id: data[0]?._id.$oid,
                Kab_kota: data[0]?.name,
              });
            } else {
              setFormData({ ...formData, prov_id: "", Kab_kota: "" });
            }
          };
          const addGeoData = async () => {
            if (formData.prov_id == "") {
              return;
            }
        
            const res = await fetch("/api/geodata/add", {
              method: "POST",
              body: JSON.stringify({
                geoloc_id: formData.prov_id,
                data: {
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    title: formData.title,
                    maps_link: formData.maps_link,
                    Kab_kota: formData.Kab_kota,
                    opening_hours: formData.opening_hours,
                    photo_url: formData.photo_url,
                    rating: Number(formData.rating),
                    reviews: Number(formData.reviews),
                    type: formData.type
                },
              }),
            });
            const { message } = await res.json();
            if (res.status == 201) {
              router.push("/dashboard/data");
            } else {
            }
          };
          useEffect(() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
          }, []);
          useEffect(() => {
            getMarkerGeoComp();
          }, [formData.latitude, formData.longitude]);
    return(
        <main className="p-5 px-20 flex flex-col items-center gap-5 w-full bg-[#f4f4f4] min-h-[calc(100vh-40px-93px)]">
                
            {loading ? (
              <Loader />
            ) : (
                <MapContainer
                  center={[center.latitude, center.longitude]}
                  zoom={9}
                  scrollWheelZoom={true}
                  className="w-2/3 min-h-[300px] rounded-lg overflow-hidden"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker />
                </MapContainer>
            )}
                <div
                    className="p-5 rounded-lg bg-[#4AFF92] min-w-[600px]"
                >
                    <form className="w-full flex flex-col items-start" action={addGeoData}>
                    <div
                        className="flex flex-col w-full gap-3"
                    >
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Nama</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.title} onChange={({ target }) => setFormData({ ...formData, title: target.value })} placeholder="Masukkan nama restoran/cafe" type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Rating</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.rating} onChange={({ target }) => setFormData({ ...formData, rating: target.value })} placeholder="Masukkan rating" type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Review</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.reviews} onChange={({ target }) => setFormData({ ...formData, reviews: target.value })} placeholder="Masukkan review" type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Foto</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.photo_url} onChange={({ target }) => setFormData({ ...formData, photo_url: target.value })} placeholder="Masukkan link foto" type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Google Map</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.maps_link} onChange={({ target }) => setFormData({ ...formData, maps_link: target.value })} placeholder="Masukkan link google map" type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Waktu Buka</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.opening_hours} onChange={({ target }) => setFormData({ ...formData, opening_hours: target.value })} placeholder="Monday: 7:00 AM – 7:00 PM, ..." type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Type</p>
                            <select className="w-full rounded-md shadow-xl p-1" value={formData.type} onChange={({ target }) => setFormData({ ...formData, type: target.value })} placeholder="Cafe/Resto">
                              <option value="Cafe">Cafe</option>
                              <option value="Resto">Resto</option>
                            </select>
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Kota/Kabupaten</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.Kab_kota} disabled placeholder="Masukkan kota/kabupaten" type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Latitude</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.latitude} disabled placeholder="Masukkan latitude" type="text" />
                        </div>
                        <div
                            className="flex flex-col w-full gap-2"
                        >
                            <p>Longitude</p>
                            <input className="w-full rounded-md shadow-xl p-1" value={formData.longitude} disabled placeholder="Masukkan longitude" type="text" />
                        </div>
                    </div>
                    <button className="bg-[#00840D] mt-5 min-w-[100px] py-1 text-white font-bold rounded-md">
                        Submit
                    </button>
                    </form>
                </div>
            </main>
    )
}