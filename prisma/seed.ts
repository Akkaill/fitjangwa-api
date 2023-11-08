import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.createMany({
    data: [
      {
        name: "Upperbody Workout",
        slug: "upperbody-woekout",
      },

      {
        name: "Lowerbody Workout",
        slug: "lowerbody-workout",
      },
      {
        name: "Cardio",
        slug: "cardio",
      },
    ],
  });
  const product = await prisma.product.createMany({
    data: [
      {
        name: "Chest For beginner",
        price: 999,
        desc: "",
        stock: 4,
        detail: "",
        slug: "938467001",
        images: ["http://localhost:4000/assets/chest.webp"],
      },
      {
        name: "Delt for The guy who want to massive like Sam sulek",
        price: 1999,
        desc: "",
        stock: 1,
        detail: "",
        slug: "938467002",
        images: ["http://localhost:4000/assets/maxresdefault.jpg"],
      },
      {
        name: "Triceps of planet",
        price: 899,
        desc: "",
        stock: 1,
        detail: "",
        slug: "938467003",
        images: ["http://localhost:4000/assets/upperbody.jpg"],
      },
      {
        name: "Train Biceps to be a part of ur weapon ",
        price: 799,
        desc: "",
        stock: 1,
        detail: "",
        slug: "938467004",
        images: ["http://localhost:4000/assets/upperbody.jpg"],
      },
      {
        name: "Abs",
        price: 499,
        desc: "499",
        stock: 1,
        detail: "",
        slug: "938467005",
        images: ["http://localhost:4000/assets/upperbody.jpg"],
      },
      {
        name: "For a person who doesnt want to skip leg day",
        price: 699,
        desc: "",
        stock: 1,
        detail: "",
        slug: "938467006",
        images: ["http://localhost:4000/assets/lowerbody.jpg"],
      },
    ],
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    await prisma.$disconnect();
    throw err;
  });

// const product = await prisma.product.createMany({
//   data: [
//     {
//       name: "Produc1",
//       price: 100,
//       desc: "P1",
//     },
//     { name: "Produc2", price: 100, desc: "P2" },
//     { name: "Produc4", price: 100, desc: "P3" },
//     {
//       name: "Produc5",
//       price: 100,
//       desc: "P5",
//     },
//     { name: "Produc6", price: 100, desc: "P1" },
//     { name: "Produc7", price: 100, desc: "P1" },
//   ],
// });
