import Fastify, { type FastifyServerOptions } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';

export function buildApp(options: FastifyServerOptions = {}) {
  const app = Fastify(options).withTypeProvider<ZodTypeProvider>();

  // Integra os schemas Zod à validação (entrada) e serialização (saída) do Fastify
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.get(
    '/health',
    { schema: { response: { 200: z.object({ status: z.literal('ok') }) } } },
    async () => ({ status: 'ok' as const }),
  );

  return app;
}

export type App = ReturnType<typeof buildApp>;
