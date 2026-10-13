import Fastify, { type FastifyServerOptions } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';
import { registerErrorHandler } from './errors.js';
import { TaskRepository } from './modules/tasks/task.repository.js';
import { taskRoutes } from './modules/tasks/task.routes.js';

export function buildApp(options: FastifyServerOptions = {}) {
  const app = Fastify(options).withTypeProvider<ZodTypeProvider>();

  // Integra os schemas Zod à validação (entrada) e serialização (saída) do Fastify
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  registerErrorHandler(app);

  app.get(
    '/health',
    { schema: { response: { 200: z.object({ status: z.literal('ok') }) } } },
    async () => ({ status: 'ok' as const }),
  );

  // Cada instância tem seu próprio repositório (isola os testes)
  app.register(taskRoutes, { repository: new TaskRepository() });

  return app;
}

export type App = ReturnType<typeof buildApp>;
