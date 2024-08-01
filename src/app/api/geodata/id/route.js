import { getGeoDataByID } from "@/lib/prisma/geodata";

export async function GET(request) {
    try {
        const id = String(request.nextUrl.searchParams.get('id') != undefined ? request.nextUrl.searchParams.get('id') : "");
        const { res: data, error: geodataserr } = await getGeoDataByID(id);
        if (geodataserr) {
            console.log(geodataserr)
            return Response.json({ message: "internal server error" }, { status: 500 });
        }
        return Response.json({ data: data }, { status: 200 });
    } catch (error) {
        console.log(error)
        return Response.json({ message: "internal server error" }, { status: 500 });
    }
}