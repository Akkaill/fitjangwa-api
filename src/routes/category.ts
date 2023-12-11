import { SortProduct, sortProducts } from "@/libs/sortProducts";
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
    async (
      request: FastifyRequest<{
        Params: { slug: string };
        Querystring: { sort: SortProduct };
      }>,
      reply
    ) => {
      const { slug } = request.params;
      const orderBy = sortProducts(request.query.sort);
      const category = await fastify.db.category.findFirst({
        where: {
          slug,
        },
        include: {
          product: {
            ...orderBy,
          },
        },
      });
      if (!category) {
        return reply.status(404).send({ message: "Category not found" });
      }
      return reply.status(200).send(category);
    }
  );
  fastify.post(
    "/category",
    async (request: FastifyRequest<{ Body: { name: string } }>, reply) => {
      const { name } = request.body;
      const category = await fastify.db.category.create({
        data: { name, slug: name.toLowerCase().replace(/ /g, "-") },
      });
      reply.status(201).send(category);
    }
  );

  fastify.patch(
    "/category/:id",
    async (
      requset: FastifyRequest<{
        Body: { name: string; slug: string };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = requset.params;
      const { name, slug } = requset.body;
      const category = await fastify.db.category.update({
        where: {
          id,
        },
        data: {
          name,
          slug,
        },
      });
      reply.status(200).send(category);
    }
  );
}
