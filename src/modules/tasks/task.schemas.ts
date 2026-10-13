import { z } from 'zod';

/** Representação pública de uma tarefa (schema de saída). */
export const taskSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Task = z.infer<typeof taskSchema>;

const titleSchema = z
  .string({ error: 'O título é obrigatório' })
  .trim()
  .min(1, 'O título é obrigatório')
  .max(120, 'O título deve ter no máximo 120 caracteres');

const descriptionSchema = z
  .string({ error: 'A descrição deve ser um texto' })
  .trim()
  .max(500, 'A descrição deve ter no máximo 500 caracteres');

/** Body de POST /tasks. */
export const createTaskBodySchema = z.object({
  title: titleSchema,
  description: descriptionSchema.optional(),
  completed: z.boolean({ error: 'completed deve ser booleano' }).default(false),
});

export type CreateTaskInput = z.infer<typeof createTaskBodySchema>;

/** Querystring de GET /tasks. */
export const listTasksQuerySchema = z.object({
  completed: z
    .enum(['true', 'false'], { error: 'completed deve ser "true" ou "false"' })
    .transform((value) => value === 'true')
    .optional(),
});

export type ListTasksFilter = z.infer<typeof listTasksQuerySchema>;

/** Params das rotas que recebem /tasks/:id. */
export const taskParamsSchema = z.object({
  id: z.uuid({ error: 'O ID deve ser um UUID válido' }),
});
