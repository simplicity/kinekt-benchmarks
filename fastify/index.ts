import cors from "@fastify/cors";
import Fastify from "fastify";
import { range } from "../range.ts";

const fastify = Fastify();

await fastify.register(cors);

range.forEach((index1) => {
  range.forEach((index2) => {
    fastify.post(`/${index1}/${index2}`, async (request, reply) => {
      return reply.status(201).send(request.body);
    });
  });
});

const PORT = 3003;
fastify.listen({ port: PORT }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});
