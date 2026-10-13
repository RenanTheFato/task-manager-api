import { STATUS_CODES } from 'node:http';
import type { FastifyError, FastifyInstance } from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from 'fastify-type-provider-zod';
import { z } from 'zod';

/** Formato padronizado de erro devolvido por toda a API. */
export const errorResponseSchema = z.object({
  statusCode: z.number().int(),
  error: z.string(),
  message: z.string(),
  details: z
    .array(z.object({ field: z.string(), message: z.string() }))
    .optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

/** Erro de domínio com status HTTP associado. */
export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly error: string,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, 'Not Found', message);
    this.name = 'NotFoundError';
  }
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setNotFoundHandler((request, reply) => {
    const body: ErrorResponse = {
      statusCode: 404,
      error: 'Not Found',
      message: `Rota ${request.method} ${request.url} não encontrada`,
    };
    return reply.status(404).send(body);
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    // Entrada inválida (body, params ou querystring) rejeitada pelo Zod
    if (hasZodFastifySchemaValidationErrors(error)) {
      const body: ErrorResponse = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Dados da requisição inválidos',
        details: error.validation.map((issue) => ({
          field: [error.validationContext, ...issue.instancePath.split('/').filter(Boolean)].join('.'),
          message: issue.message ?? 'Valor inválido',
        })),
      };
      return reply.status(400).send(body);
    }

    if (error instanceof AppError) {
      const body: ErrorResponse = {
        statusCode: error.statusCode,
        error: error.error,
        message: error.message,
      };
      return reply.status(error.statusCode).send(body);
    }

    // Resposta que não bate com o schema de saída: erro do servidor, não do cliente
    if (isResponseSerializationError(error)) {
      request.log.error({ issues: error.cause.issues }, 'Resposta fora do schema');
    } else {
      request.log.error(error);
    }

    // JSON malformado e outros erros 4xx do próprio Fastify
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      const body: ErrorResponse = {
        statusCode: error.statusCode,
        error: STATUS_CODES[error.statusCode] ?? 'Bad Request',
        message: error.message,
      };
      return reply.status(error.statusCode).send(body);
    }

    const body: ErrorResponse = {
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Erro interno do servidor',
    };
    return reply.status(500).send(body);
  });
}
