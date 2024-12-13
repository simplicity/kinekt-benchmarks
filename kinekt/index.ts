import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import {
  cors,
  createNotFoundEndpoint,
  createPipeline,
  createSchematizedEndpointFactory,
  createServer,
  deserialize,
  finalize,
  handleValidationErrors,
  serialize,
  ValidationErrors,
} from "npm:kinekt";
import { z } from "npm:zod";
import { range } from "../range.ts";

const defaultValidationErrorHandler = (validationErrors: ValidationErrors) => ({
  statusCode: 400 as const,
  body: validationErrors,
});

export const pipeline = createSchematizedEndpointFactory(
  createPipeline(cors({ origins: "*" }), deserialize()).split(
    handleValidationErrors(defaultValidationErrorHandler),
    serialize(),
    finalize()
  )
);

const endpoints = range
  .map((index1) =>
    range.map((index2) =>
      pipeline.createEndpoint(
        `POST /${index1}/${index2}`,
        {
          body: z.object({ email: z.string() }),
          response: { 201: z.custom<{ email: string }>() },
        },
        async ({ body }) => {
          return {
            statusCode: 201,
            body,
          };
        }
      )
    )
  )
  .flat();

const serve = createServer();

serve(...endpoints, createNotFoundEndpoint());
