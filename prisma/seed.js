import prisma from "../lib/prisma/index.js";
import bcrypt from "bcrypt";
import ind_kabkota from "./INDKabKota.json" assert { type: 'json' };
import data_cafe from "./dataset-cafe.json" assert { type: 'json' };
import data_resto from "./dataset-resto.json" assert { type: 'json' };


const JawaBarat = [
    "Bandung", 
    "Bandung Barat", 
    "Bekasi", 
    "Bogor", 
    "Ciamis", 
    "Cianjur", 
    "Cirebon", 
    "Garut",  
    "Indramayu", 
    "Karawang", 
    "Kuningan", 
    "Majalengka", 
    "Pangandaran", 
    "Purwakarta", 
    "Subang", 
    "Sukabumi", 
    "Sumedang", 
    "Tasikmalaya", 
    "Kota Bandung", 
    "Kota Banjar", 
    "Kota Bekasi", 
    "Kota Bogor", 
    "Kota Cimahi", 
    "Kota Cirebon", 
    "Kota Depok", 
    "Kota Sukabumi", 
    "Kota Tasikmalaya"
]
function indjson() {
    const { features } = ind_kabkota;
    const ind = features.filter(item => JawaBarat.includes(item.properties.NAME_2)).map((item) => {
        const temp = {
            geoId: Number(item.properties.ID_2),
            name: item.properties.NAME_2,
            geojs: item,
            geodatas: {
                create: undefined,
            },
        };
        return temp;
    });
    return { ind };
}

function datarestocafe() {
  const cafe = data_cafe.map((item) => {
    const temp = {
      maps_link: item.maps_link,
      latitude: item.latitude,
      longitude: item.longitude,
      title: item.title.toString(),
      Kab_kota: item.Kab_kota,
      photo_url: item.photo_url || "",
      rating: Number(item.rating) || 0,
      reviews: Number(item.reviews) || 0,
      opening_hours: item.opening_hours || "",
      type: item.type
    };
    return temp;
  });
  const resto = data_resto.map((item) => {
    const temp = {
      maps_link: item.maps_link,
      latitude: item.latitude,
      longitude: item.longitude,
      title: item.title.toString(),
      Kab_kota: item.Kab_kota,
      photo_url: item.photo_url || "",
      rating: Number(item.rating) || 0,
      reviews: Number(item.reviews) || 0,
      opening_hours: item.opening_hours || "",
      type: item.type
    };
    return temp;
  });

  const res = cafe.concat(resto)
  return { res };
}


async function main() {
    const { ind } = indjson();
    const { res } = datarestocafe();

    // Convert to prisma input
    const prismageodata = res;
    ind.forEach((element) => {
        const resfilter = prismageodata.filter(
            (elem) => elem.Kab_kota.replace("Kabupaten ", "") == element.name
        );
        element.geodatas.create = resfilter;
    });
    const prismageoloc = ind;

    // Drop Collection
    try {
        const dropuser = await prisma.$runCommandRaw({
            drop: "User",
        });
        const dropgeoloc = await prisma.$runCommandRaw({
            drop: "GeoLocation",
        });
        const dropgeodata = await prisma.$runCommandRaw({
            drop: "GeoData",
        });
    } catch (error) {
        // console.log(error);
    }

    // Insert Account
    const rand1 = await bcrypt.genSalt(10);
    const admin = await prisma.user.create({
        data: {
            username: "adminnopal",
            name: "admin",
            password: await bcrypt.hash("admin123", rand1),
            salt: rand1,
        },
    });

    // Insert Geoloc and Geodata
    for (let i = 0; i < prismageoloc.length; i++) {
        const gjs = await prisma.geoLocation.create({
            data: prismageoloc[i],
        });
    }

    // Build Geo Index
    const geoidx = await prisma.$runCommandRaw({
        createIndexes: "GeoLocation",
        indexes: [
            {
                key: {
                    "geojs.geometry": "2dsphere",
                },
                name: "geospat",
            },
        ],
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });