import { getGeoLocs } from "@/lib/prisma/geoloc.js";
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export async function GET(request) {
    try {
        const type = request.nextUrl.searchParams.get('type') != undefined ? request.nextUrl.searchParams.get('type') : "";
        const { res, error } = await getGeoLocs(type);
        if (error) {
            console.log(error)
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: res }, { status: 200 });
    } catch (error) {
        console.log(error)
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}