import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import {
  LoginSchema,
  LoginType,
  RegisterSchema,
  RegisterType,
} from "@/types/user";
import { comparePassword, hashPassword } from "@/libs/hashPassword";

type DECODED = {
  id: string;
  ist: number;
  exp: number;
};
export default async function Userroute(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    { preValidation: [fastify.authenticate] },
    async (
      request: FastifyRequest<{
        Headers: { authorization: string };
        Querystring: { all: boolean };
      }>,
      reply
    ) => {
      try {
        const requeser = request.user as DECODED;
        const { all } = request.query;
        const users = await fastify.db.user.findUnique({
          where: {
            id: requeser.id,
          },
        });
        if (!users) {
          {
            return reply.status(404).send({ message: "User not found" });
          }
        }
        return reply.status(200).send(users);
      } catch (error) {
        reply.status(500).send({ message: error });
      }
    }
  );
  fastify.post(
    "/login",
    async (request: FastifyRequest<{ Body: LoginType }>, reply) => {
      try {
        const { email, password } = request.body;
        LoginSchema.parseAsync(request.body);

        const userExist = await fastify.db.user.findUnique({
          where: {
            email,
          },
        });
        if (userExist) {
          const passwordMatch = await comparePassword(
            password,
            userExist.password
          );
          if (!passwordMatch) {
            return reply.status(400).send({ message: "Wrong number" });
          }
          const token = fastify.jwt.sign({ id: userExist.id });
          return reply.send({ token: token });
        }

        return reply
          .status(404)
          .send({ message: "You must to register first" });
      } catch (error) {
        reply.status(500).send(error);
      }
    }
  );
  // fastify.post("/logout", async (request, reply) => {
  //   return reply
  //     .clearCookie("token")
  //     .status(200)
  //     .send({ message: "Logout succesfully" });
  // });
  fastify.post(
    "/verify-token",
    async (
      request: FastifyRequest<{ Headers: { authorization: string } }>,
      reply
    ) => {
      try {
        await request.jwtVerify();
        return reply.status(200).send({ message: "Token is valid" });
      } catch (err) {
        return reply.status(401).send({ message: "Token is invalid" });
      }
    }
  );

  fastify.post(
    "/register",
    async (request: FastifyRequest<{ Body: RegisterType }>, reply) => {
      try {
        const { name, password, email, address, phone } = request.body;
        const hashpassword = await hashPassword(password);

        await RegisterSchema.parseAsync(request.body);

        const userExist = await fastify.db.user.findUnique({
          where: {
            email,
          },
        });
        if (userExist) {
          return reply.status(400).send({ messgae: "Email exist" });
        }
        const user = await fastify.db.user.create({
          data: {
            name,
            email,
            password: hashpassword,
            address,
            phone,
          },
        });
        return reply.status(200).send(user);
      } catch (error) {
        return reply.status(500).send(error);
      }
    }
  );
}
