import { getGeoDataByName } from "@/lib/prisma/geodata";

export async function GET(request) {
    try {
        const filter = String(request.nextUrl.searchParams.get('filter') != undefined ? request.nextUrl.searchParams.get('filter') : "");
        const take = Number(request.nextUrl.searchParams.get('take') != undefined ? request.nextUrl.searchParams.get('take') : 10);
        const page = Number(request.nextUrl.searchParams.get('page') != undefined ? request.nextUrl.searchParams.get('page') : 1);
        const type = request.nextUrl.searchParams.get('type') != undefined ? request.nextUrl.searchParams.get('type') : "";
        const rating = Number(request.nextUrl.searchParams.get('rating') != undefined ? request.nextUrl.searchParams.get('rating') : 0);
        const kabkota = request.nextUrl.searchParams.get('kabkota') != undefined ? request.nextUrl.searchParams.get('kabkota') : "";
        const { res: data, count: count, error: geosearcherr } = await getGeoDataByName(filter, take, page, type, rating, kabkota);
        if (geosearcherr) {
            console.log(geosearcherr)
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: data, count: count }, { status: 200 });
    } catch (error) {
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}