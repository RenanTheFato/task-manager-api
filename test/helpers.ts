import { buildApp, type App } from '../src/app.js';
import type { Task } from '../src/modules/tasks/task.schemas.js';

export async function createTestApp(): Promise<App> {
  const app = buildApp();
  await app.ready();
  return app;
}

/** Cria uma tarefa via API e devolve o corpo da resposta. */
export async function createTask(
  app: App,
  payload: Record<string, unknown> = { title: 'Tarefa de teste' },
): Promise<Task> {
  const response = await app.inject({ method: 'POST', url: '/tasks', payload });
  return response.json<Task>();
}
