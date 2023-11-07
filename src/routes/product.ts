import fastify, { FastifyInstance, FastifyRequest } from "fastify";
export default async function ProductRoute(fastify: FastifyInstance) {
  fastify.get("/products", async (request, reply) => {
    const products = await fastify.db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    reply.status(200).send(products);
  });
  fastify.get(
    "/products/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      const product = await fastify.db.product.findFirstOrThrow({
        where: {
          id,
        },
      });
      reply.status(200).send(product);
    }
  );
  fastify.post(
    "/products",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          price: number;
          desc: string;
          image: string;
          categories_id?: string;
        };
      }>,
      reply
    ) => {
      const { name, price, desc, image, categories_id } = request.body;
      try {
        if (categories_id) {
          const product = await fastify.db.product.create({
            data: {
              name,
              price,
              desc,
              images: [image],
              category: {
                connect: {
                  id: categories_id,
                },
              },
            },
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          });
          return reply.status(201).send(product);
        }
        const product = await fastify.db.product.create({
          data: {
            name,
            price,
            desc,
            images: [image],
          },
        });

        return reply.status(201).send(product);
      } catch (error) {
        reply.status(500).send(error);
      }
    }
  );
  fastify.patch(
    "/products/:id",
    async (
      request: FastifyRequest<{
        Body: {
          name: string;
          price: number;
          desc: string;
          image: string;
        };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = request.params;
      const { name, price, desc, image } = request.body;
      const product = await fastify.db.product.update({
        where: {
          id,
        },
        data: {
          name,
          price,
          desc,
          images: [image],
        },
      });
      reply.status(200).send(product);
    }
  );
  fastify.delete(
    "/products/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      await fastify.db.product.delete({
        where: {
          id,
        },
      });
      reply.status(200).send({ message: "deleted" });
    }
  );
}
