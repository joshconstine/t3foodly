import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const phills = await prisma.restaurant.upsert({
        where: { id: "1" },
        update: {},
        create: {
            id: "1",
            name: "Phills BBQ",
            description: "this place has amazing cornbread",
        },
    });
    const joses = await prisma.restaurant.upsert({
        where: { id: "2" },
        update: {
            name: "Joses",
            description: "Mexican in la Jolla",
        },
        create: {
            id: "2",
            name: "Joses",
            description: "Mexican in la Jolla",
        },
    });
    //   const comment1 = await prisma.comment.upsert({
    //     where: { id: 1 },
    //     update: {},
    //     create: {
    //       id: 1,
    //       text: "cornbread is verry good",
    //       restaurant_id: 1,
    //       rating_id: 1,
    //       user_id: 2,
    //     },
    //   });
    //   const comment2 = await prisma.comment.upsert({
    //     where: { id: 2 },
    //     update: {},
    //     create: {
    //       id: 2,
    //       text: "the dip trio is my favorite",
    //       restaurant_id: 2,
    //       rating_id: 2,
    //       user_id: 1,
    //     },
    //   });
    //   const comment3 = await prisma.comment.upsert({
    //     where: { id: 3 },
    //     update: {},
    //     create: {
    //       id: 3,
    //       text: "The line is worth it",
    //       restaurant_id: 1,
    //       rating_id: 3,
    //       user_id: 1,
    //     },
    //   });

    console.log({ phills, joses });
    //   console.log({ comment1, comment2, comment3 });
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
export { };