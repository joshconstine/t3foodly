import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const comments = await prisma.comment.deleteMany();
  console.log({ comments });
  const favorites = await prisma.favorite.deleteMany();
  const deleted = await prisma.restaurant.deleteMany();
  console.log({ deleted });
  const phills = await prisma.restaurant.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "Phills BBQ",
      cityName: "San Diego",
      stateName: "CA",
      zipCode: "92101",
      lat: "32.7485834",
      lng: "-117.2357851",
    },
  });
  const joses = await prisma.restaurant.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      name: "Joses",
      cityName: "San Diego",
      stateName: "CA",
      zipCode: "92101",
      lat: "32.8478312",
      lng: "-117.2761122",
    },
  });
  const thai = await prisma.restaurant.upsert({
    where: { id: "3" },
    update: {},
    create: {
      id: "3",
      name: "Thai Thai",
      cityName: "Santee",
      stateName: "CA",
      zipCode: "92071",
      lat: "32.8455439",
      lng: "-117.0083525",
    },
  });

  const user1 = await prisma.user.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      name: "John Doe",
      username: "FlavorDoctor",
      email: "joe@gmail.com",
    },
  });
  const user2 = await prisma.user.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      name: "Jane Doe",
      username: "FlavorQueen",
      email: "jamedoe@gmail.com",
    },
  });

  const comment1 = await prisma.comment.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      text: "cornbread is verry good",
      restaurant_id: "1",
      user_id: "2",
    },
  });
  const comment2 = await prisma.comment.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      text: "the dip trio is my favorite",
      restaurant_id: "2",
      user_id: "1",
    },
  });
  const comment3 = await prisma.comment.upsert({
    where: { id: "3" },
    update: {},
    create: {
      id: "3",
      text: "The line is worth it",
      restaurant_id: "1",
      user_id: "1",
    },
  });

  const upvote1 = await prisma.upVote.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      restaurant_id: "1",
      user_id: "1",
    },
  });
  const upvote2 = await prisma.upVote.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      restaurant_id: "2",
      user_id: "2",
    },
  });
  const upvote3 = await prisma.upVote.upsert({
    where: { id: "3" },
    update: {},
    create: {
      id: "3",
      restaurant_id: "2",
      user_id: "1",
    },
  });

  const downvote1 = await prisma.downVote.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      restaurant_id: "1",
      user_id: "2",
    },
  });

  const deletedPhotos = await prisma.photo.deleteMany();
  console.log({ deletedPhotos });

  const phillsPhotos = await prisma.photo.upsert({
    where: { id: "1" },
    update: {},
    create: {
      id: "1",
      restaurant_id: "1",
      photoUrl: `${process.env.BUCKET_URL}/phills.jpeg`,
    },
  });
  const josesPhotos = await prisma.photo.upsert({
    where: { id: "2" },
    update: {},
    create: {
      id: "2",
      restaurant_id: "2",
      photoUrl: `${process.env.BUCKET_URL}/joses.jpeg`,
    },
  });
  const cuisines = [
    "American",
    "Asian",
    "Barbecue",
    "Burgers",
    "Cajun",
    "Caribbean",
    "Chinese",
    "Deli",
    "Desserts",
    "Fast Food",
    "French",
    "Greek",
    "Indian",
    "Italian",
    "Japanese",
    "Korean",
  ];
  cuisines.forEach(async (cuisine) => {
    await prisma.cuisine.upsert({
      where: { name: cuisine },
      update: {},
      create: {
        name: cuisine,
      },
    });
  });

  console.log({ phills, joses, thai });
  console.log({ comment1, comment2, comment3 });
  console.log({ user1, user2 });
  console.log({ upvote1, upvote2, upvote3 });
  console.log({ downvote1 });
  console.log({ phillsPhotos, josesPhotos });
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
export {};
