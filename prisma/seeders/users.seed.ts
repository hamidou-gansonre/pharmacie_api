
import bcrypt from "bcryptjs";
import { PrismaClient } from "../../src/generated/prisma/client";

const users = [
    {
        email: 'amidoug7@gmail.com',
        password: 'Never68Trust38Web',
        role: 'admin' as const,
    },
    {
        email: 'amidou@burkindi-media.com',
        password: 'Never98Trust19Web',
        role: 'moderateur' as const,
    },
];

export const seedUsers = async (prisma: PrismaClient) => {
    await Promise.all(users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);

        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
                email: user.email,
                password: hashedPassword,
                role: user.role,

            },
        });
    }));

}