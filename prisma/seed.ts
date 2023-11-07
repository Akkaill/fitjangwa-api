import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Akkaill",
      email: "kunlaphat@mail.com",
      password: "12345",
    },
  });
  const product = await prisma.product.createMany({
    data: [
      { name: "p1", price: 100, desc: "asd", image: "" },
      { name: "p2", price: 200, desc: "aaaa", image: "" },
    ],
  });
  const category = await prisma.category.createMany({
    data: [{ name: "cate1" }, { name: "cate2" }],
  });

  console.log({ user, product, category });
  console.log("DONE");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    await prisma.$disconnect();
    throw err;
  });

const product = await prisma.product.createMany({
  data: [
    {
      name: "Produc1",
      price: 100,
      desc: "P1",
    },
    { name: "Produc2", price: 100, desc: "P2" },
    { name: "Produc4", price: 100, desc: "P3" },
    {
      name: "Produc5",
      price: 100,
      desc: "P5",
    },
    { name: "Produc6", price: 100, desc: "P1" },
    { name: "Produc7", price: 100, desc: "P1" },
  ],
});
