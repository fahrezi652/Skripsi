"use client"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Pagination } from "flowbite-react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { Button, Modal, Dropdown } from "flowbite-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
const TABLE_HEAD = ["No", "Nama", "Type", "Rating", "Review", "Kota/Kabupaten", "Maps", "Action"];
 
export default function DataPage(){
    const [loading, setLoading] = useState(true);
    const [geodatas, setGeodatas] = useState({ data: [], count: 0 });
    const [openModal, setOpenModal] = useState(false);
    const [item, setItem] = useState("");
    const [kabkotaList, setKabkotaList] = useState([])
    const [kabkota, setKabkota] = useState("")
    const [type, setType] = useState("")
    const [rating, setRating] = useState(0)
    const {status} = useSession()
    // useEffect(() => {
    //     if(status == "unauthenticated"){
    //         redirect("/")
    //     }
    // }, [status])

    const [currentFilter, setCurrentFilter] = useState({
        search: "",
        take: 10,
        page: 1,
        cafeResto: "",
        mode: "default",
        toggle: true,
    });

    const onPageChange = (page) =>
    setCurrentFilter({
        ...currentFilter,
        page: page,
        toggle: !currentFilter.toggle,
    });

    const geodataAPI = async () => {
        const kabKota = await fetch("/api/geodata/kabkota", {
            method: "GET",
        });
        const kabkotaRes = await kabKota.json()
        setKabkotaList(kabkotaRes.data)
      const res = await fetch(
          "/api/geodata?" +
          new URLSearchParams({
              take: currentFilter.take.toString(),
              page: currentFilter.page.toString(),
          }),
          {
              method: "GET",
              cache: "no-store",
          }
      );
      const { data, count } = await res.json();
      setGeodatas({ data: data, count: count });
      setLoading(false)
  };
  const geodataSearch = async () => {
      setGeodatas({ data: [], count: 0 });
      const res = await fetch(
          "/api/geodata/search?" +
          new URLSearchParams({
            filter: currentFilter.search,
            take: currentFilter.take.toString(),
            page: currentFilter.page.toString(),
            type: type,
            rating: rating,
            kabkota: kabkota
        }),
          {
              method: "GET",
          }
      );
      const { data, count } = await res.json();
      
      setGeodatas({ data: data, count: count });
      setLoading(false)
  };
  const geodataDelete = async (id) => {
    const res = await fetch("/api/geodata/delete", {
        method: "POST",
        body: JSON.stringify({ id: id }),
    });
    if (res.status == 200) {
        setCurrentFilter({ ...currentFilter, toggle: !currentFilter.toggle });
    }
    setOpenModal(false)
    setLoading(false)
};

  useEffect(() => {
    setLoading(true)
    if (currentFilter.mode == "search") {
        geodataSearch();
        setCurrentFilter({ ...currentFilter, mode: "search"});
    }
    if (currentFilter.mode == "default") {
      geodataAPI();
    }
    setTimeout(() => setLoading(false), 1000);
  }, [currentFilter.toggle]);

    return(
        <>
            <Navbar dashboard />
            <main className="relative p-5 px-20 flex flex-col justify-between items-end gap-5 bg-[#f5f5f5] min-h-[calc(100vh-40px-93px)]">
                {loading && <Loader />}
                <div className="flex gap-10">
                <div className="flex gap-1">
                        <button onClick={() => {setRating(1);setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            {
                                rating >= 1 ?
                                <img className="w-8 aspect-square" src="/starFilled.png" />
                                :
                                <img className="w-8 aspect-square" src="/starOutline.png" />
                            }
                        </button>
                        <button onClick={() => {setRating(2);setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            {
                                rating >= 2 ?
                                <img className="w-8 aspect-square" src="/starFilled.png" />
                                :
                                <img className="w-8 aspect-square" src="/starOutline.png" />
                            }
                        </button>
                        <button onClick={() => {setRating(3);setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            {
                                rating >= 3 ?
                                <img className="w-8 aspect-square" src="/starFilled.png" />
                                :
                                <img className="w-8 aspect-square" src="/starOutline.png" />
                            }
                        </button>
                        <button onClick={() => {setRating(4);setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            {
                                rating >= 4 ?
                                <img className="w-8 aspect-square" src="/starFilled.png" />
                                :
                                <img className="w-8 aspect-square" src="/starOutline.png" />
                            }
                        </button>
                        <button onClick={() => {setRating(5);setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            {
                                rating >= 5 ?
                                <img className="w-8 aspect-square" src="/starFilled.png" />
                                :
                                <img className="w-8 aspect-square" src="/starOutline.png" />
                            }
                        </button>
                    </div>
                    <Dropdown label={type == "" ? "Cafe/Resto" : type} style={{ backgroundColor: "black", color: "white" }} dismissOnClick={false}>
                        <Dropdown.Item onClick={() => {setType("");setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            Cafe/Resto
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => {setType("Cafe");setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            Cafe
                        </Dropdown.Item>
                        <Dropdown.Item  onClick={() => {setType("Resto");setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            Resto
                        </Dropdown.Item>
                    </Dropdown>
                    <Dropdown className="h-[500px] overflow-scroll" label={kabkota == "" ? "Kabupaten/Kota" : kabkota} style={{ backgroundColor: "black", color: "white" }} dismissOnClick={false}>
                        <Dropdown.Item onClick={() => {setKabkota("");setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                            Kabupaten/Kota
                        </Dropdown.Item>
                        {kabkotaList.length > 0 && kabkotaList.map(d => 
                            <Dropdown.Item onClick={() => {setKabkota(d.Kab_kota);setCurrentFilter({ ...currentFilter, mode: "search", toggle: !currentFilter.toggle, page: 1 })}}>
                                {d.Kab_kota}
                            </Dropdown.Item>
                        )}
                    </Dropdown>
                  <div className="w-[300px] relative">
                      <input type="text" placeholder="Search" className="w-full p-2 rounded-md shadow-xl" value={currentFilter.search}
                          onChange={({ target }) => {
                              setCurrentFilter({ ...currentFilter, search: target.value, mode: "search", toggle: !currentFilter.toggle, page: 1 });
                          }} />
                      <img src="/search.png" className="w-5 h-auto absolute top-[10px] right-[10px]" alt="" />
                  </div>
                   <a href="/dashboard/addData" className="bg-[#D9D9D9] text-center min-w-[200px] flex justify-center items-center rounded-full border shadow-xl border-black">
                     Add Data
                   </a>
                </div>
                <table className="w-full min-w-max table-auto text-left bg-white rounded-lg h-full">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head) => (
                        <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                            <p
                            className="font-normal leading-none opacity-70"
                            >
                            {head}
                            </p>
                        </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {geodatas.data.map((data, index) => (
                        <tr key={data.title} className="even:bg-blue-gray-50/50">
                        <td className="p-4">
                            <p variant="small" color="blue-gray" className="font-normal">
                            {(index+1)+(10*(currentFilter.page-1))}
                            </p>
                        </td>
                        <td className="p-4">
                            <p variant="small" color="blue-gray" className="font-normal">
                            {data.title}
                            </p>
                        </td>
                        <td className="p-4">
                            <p variant="small" color="blue-gray" className="font-normal">
                            {data.type}
                            </p>
                        </td>
                        <td className="p-4">
                            <p variant="small" color="blue-gray" className="font-normal">
                            {data.rating}
                            </p>
                        </td>
                        <td className="p-4">
                            <p variant="small" color="blue-gray" className="font-normal">
                            {data.reviews}
                            </p>
                        </td>
                        <td className="p-4">
                            <p variant="small" color="blue-gray" className="font-normal">
                            {data.Kab_kota}
                            </p>
                        </td>
                        <td className="p-4">
                            <a target="_blank" href={data.maps_link} variant="small" color="blue-gray" className="font-normal">
                              Maps
                            </a>
                        </td>
                        <td className="p-4 flex gap-2">
                            <a href={`/dashboard/data/${data.id}`} variant="small" color="blue-gray" className="font-medium">
                                    <svg
                                        className="fill-current"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                                            fill=""
                                        />
                                        <path
                                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                                            fill=""
                                        />
                                    </svg>
                            </a>
                            <a href={`/dashboard/editData/${data.id}`} variant="small" color="blue-gray" className="font-medium">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="#000000"
                                    viewBox="0 0 256 256"
                                >
                                    <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"></path>
                                </svg>
                            </a>
                            <button onClick={() => {setOpenModal(true);setItem(data.id)}}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="#000000"
                                    viewBox="0 0 256 256"
                                >
                                    <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
                                </svg>
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                {/* <div className="flex overflow-x-auto sm:justify-end mx-8 mt-2 mb-8"> */}
                    <Pagination
                        className="flex"
                        currentPage={currentFilter.page}
                        totalPages={Math.ceil(geodatas.count / currentFilter.take)}
                        onPageChange={onPageChange}
                        previousLabel=""
                        nextLabel=""
                        showIcons
                    />
                {/* </div> */}
                <Modal
                show={openModal}
                size="md"
                onClose={() => setOpenModal(false)}
                position="center"
                className=" !bg-slate-600/20"
                dismissible
                popup
            >
                <Modal.Header />
                <Modal.Body >
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Apakah anda yakin ingin menghapus data ini?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button
                                color="failure"
                                onClick={(e) => { geodataDelete(item.toString()) }}
                            >
                                Iya
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                Tidak
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            </main>
            <Footer />
        </>
    )
}