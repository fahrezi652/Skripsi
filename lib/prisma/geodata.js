import prisma from ".";

export async function getGeoDatas(take, page) {
    try {
        const res = await prisma.geoData.findMany({
            skip: (page - 1) * take,
            take: take,
            orderBy: [
                {
                    title: "asc",
                },
                {
                    id: "asc",
                },
            ],
        });
        const count = await prisma.geoData.count();
        return { res, count };
    } catch (error) {
        return { error };
    }
}

export async function getGeoDataByID(id) {
    try {
        const res = await prisma.geoData.findFirst({
            where: {
                id: id,
            },
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function getGeoDataByName(
    name,
    take,
    page,
    type,
    rating,
    kabkota
) {
    try {
        const res = await prisma.geoData.findMany({
            skip: (page - 1) * take,
            take: take,
            where: {
                AND: [
                    {
                        OR: [
                            {
                                title: {
                                    contains: name,
                                    mode: "insensitive",
                                },
                            }
                        ]
                    },
                    {
                        type: type ? { equals: type } : undefined,
                    },
                    {
                        rating: rating ? { gte: rating } : undefined,
                    },
                    {
                        Kab_kota: kabkota ? { equals: kabkota } : undefined,
                    }
                ]
            },
            orderBy: [
                {
                    rating: "asc",
                },
                {
                    reviews: "desc",
                },
            ],
        });
        const count = await prisma.geoData.count({
            where: {
                AND: [
                    {
                        OR: [
                            {
                                title: {
                                    contains: name,
                                    mode: "insensitive",
                                },
                            }
                        ]
                    },
                    {
                        type: type ? { equals: type } : undefined,
                    },
                    {
                        rating: rating ? { gte: rating } : undefined,
                    },
                    {
                        Kab_kota: kabkota ? { equals: kabkota } : undefined,
                    }
                ]
            },
            orderBy: [           
                {
                    rating: "asc",
                },
                {
                    reviews: "desc",
                },
            ],
        });
        return { res, count };
    } catch (error) {
        return { error };
    }
}


export async function getKotaKabupaten() {
    try {
        const res = await prisma.geoData.groupBy({
            by: ["Kab_kota"],
            orderBy: [
                {
                    Kab_kota: "asc",
                },
            ],
        });

        return { res };
    } catch (error) {
        return { error };
    }
}

export async function addGeoData(id, data) {
    try {
        const res = await prisma.geoLocation.update({
            where: {
                id: id,
            },
            data: {
                geodatas: {
                    create: data,
                },
            },
        });
        return { res };
    } catch (error) {
        console.log(error);
        return { error };
    }
}

export async function editGeoData(id, data) {
    try {
        const res = await prisma.geoData.update({
            where: {
                id: id,
            },
            data: data,
        });
        return { res };
    } catch (error) {
        return { error };
    }
}

export async function deleteGeoData(id) {
    try {
        const res = await prisma.geoData.delete({
            where: {
                id: id,
            },
        });
        return { res };
    } catch (error) {
        return { error };
    }
}