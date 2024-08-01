import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="p-5 px-20 flex justify-between items-center gap-20 bg-[#00840D] min-h-[calc(100vh-40px-93px)]">
        <img className="w-[400px] h-[400px]" src="/illustration.png" alt="Illustration" />
        <div className="flex flex-col gap-10 text-white">
          <h1 className="text-8xl font-bold text-center font-baloo">CaReMap</h1>
          <p className=" text-6xl text-center font-koh">
            An easy way to know how much and choose cafe and restaurant in West Java
          </p>
        </div>
      </main>

      <Footer />      
    </>
  );
}
