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
    "/category/:slug",
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply) => {
      const { slug } = request.params;
      const category = await fastify.db.category.findFirstOrThrow({
        where: {
          slug,
        },
        include: {
          product: true,
        },
      });
      reply.status(200).send(category);
    }
  );
  fastify.post(
    "/category",
    async (
      request: FastifyRequest<{ Body: { name: string; slug: string } }>,
      reply
    ) => {
      const { name, slug } = request.body;
      const category = await fastify.db.category.create({
        data: { name, slug },
      });
      reply.status(201).send(category);
    }
  );
}
