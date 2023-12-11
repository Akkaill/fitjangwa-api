import { Product } from "@prisma/client";
import fastify, { FastifyInstance, FastifyRequest } from "fastify";

type SortProduct =
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc"
  | "created_at_asc"
  | "created_at_desc";

export default async function ProductRoute(fastify: FastifyInstance) {
  fastify.get(
    "/products",
    async (
      request: FastifyRequest<{
        Querystring: { slug: string; sort: SortProduct };
      }>,
      reply
    ) => {
      const { slug, sort } = request.query;
      let ProductSort;
      switch (sort) {
        case "price_asc":
          ProductSort = {
            orderBy: {
              price: "asc",
            },
          };
          break;
        case "price_desc":
          ProductSort = {
            orderBy: {
              price: "desc",
            },
          };
          break;
        case "name_asc":
          ProductSort = {
            orderBy: {
              name: "asc",
            },
          };
          break;
        case "created_at_asc":
          ProductSort = {
            orderBy: {
              createdAt: "asc",
            },
          };
          break;
        case "created_at_desc":
          ProductSort = {
            orderBy: {
              createdAt: "desc",
            },
          };
          break;
        default:
          break;
      }

      if (slug) {
        const product = await fastify.db.product.findFirstOrThrow({
          where: {
            slug,
          },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });
        return reply.status(200).send(product);
      }
      const products = await fastify.db.product.findMany({
        ...ProductSort,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
      return reply.status(200).send(products);
    }
  );
  fastify.get(
    "/products/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const { id } = request.params;
      const product = await fastify.db.product.findFirstOrThrow({
        where: {
          id,
        },
      });
      return reply.status(200).send(product);
    }
  );
  fastify.post(
    "/products",
    async (
      request: FastifyRequest<{
        Body: {
          product_type: Product;
          categories_id?: string;
        };
      }>,
      reply
    ) => {
      const { product_type, categories_id } = request.body;
      try {
        if (categories_id) {
          const product = await fastify.db.product.create({
            data: {
              ...product_type,
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
            ...product_type,
          },
        });

        return reply.status(201).send(product);
      } catch (error) {
        return reply.status(500).send(error);
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
          detail: string;
        };
        Params: { id: string };
      }>,
      reply
    ) => {
      const { id } = request.params;
      const { name, price, desc, image, detail } = request.body;
      const product = await fastify.db.product.update({
        where: {
          id,
        },
        data: {
          name,
          price,
          desc,
          images: [image],
          detail,
        },
      });
      return reply.status(200).send(product);
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
      return reply.status(200).send({ message: "deleted" });
    }
  );
}
