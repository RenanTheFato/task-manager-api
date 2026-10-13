import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { errorResponseSchema } from '../../errors.js';
import type { TaskRepository } from './task.repository.js';
import { createTaskBodySchema, taskSchema } from './task.schemas.js';

interface TaskRoutesOptions {
  repository: TaskRepository;
}

export const taskRoutes: FastifyPluginAsyncZod<TaskRoutesOptions> = async (
  app,
  { repository },
) => {
  app.post(
    '/tasks',
    {
      schema: {
        body: createTaskBodySchema,
        response: {
          201: taskSchema,
          400: errorResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const task = repository.create(request.body);
      return reply.status(201).send(task);
    },
  );
};
