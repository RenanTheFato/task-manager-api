import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { errorResponseSchema, NotFoundError } from '../../errors.js';
import type { TaskRepository } from './task.repository.js';
import {
  createTaskBodySchema,
  listTasksQuerySchema,
  taskParamsSchema,
  taskSchema,
} from './task.schemas.js';

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

  app.get(
    '/tasks',
    {
      schema: {
        querystring: listTasksQuerySchema,
        response: {
          200: z.array(taskSchema),
          400: errorResponseSchema,
        },
      },
    },
    async (request) => repository.findAll(request.query),
  );

  app.get(
    '/tasks/:id',
    {
      schema: {
        params: taskParamsSchema,
        response: {
          200: taskSchema,
          400: errorResponseSchema,
          404: errorResponseSchema,
        },
      },
    },
    async (request) => {
      const task = repository.findById(request.params.id);
      if (!task) throw new NotFoundError('Tarefa não encontrada');
      return task;
    },
  );
};
