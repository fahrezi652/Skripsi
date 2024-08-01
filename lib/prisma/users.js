import prisma from ".";

// Only for authenticating
export async function getUserByUsername(username) {
    try {
        const res = await prisma.User.findFirst({
            where: { username: username}
        });
        return {user: res};
    } catch (error) {
        return { error };
    }
}

export async function getUserByID(id) {
    try {
        const res = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                email: true,
            },
            where: { id: id, }
        });
        return { res };
    } catch (error) {
        return { error };
    }
}