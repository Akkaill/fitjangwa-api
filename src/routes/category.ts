import fastify, { FastifyInstance, FastifyRequest } from "fastify";
export default async function CategoryRoute(fastify: FastifyInstance) {
  fastify.get("/category", async (request, reply) => {
    const category = await fastify.db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    reply.status(200).send(category);
  });
  fastify.get(
    "/category/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      const category = await fastify.db.category.findFirstOrThrow({
        where: {
          id,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      reply.status(200).send(category);
    }
  );
  fastify.post(
    "/category",
    async (request: FastifyRequest<{ Body: { name: string } }>, reply) => {
      const { name } = request.body;
      const category = await fastify.db.category.create({
        data: { name },
      });
      reply.status(201).send(category);
    }
  );
}
