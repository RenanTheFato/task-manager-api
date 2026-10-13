import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { App } from '../src/app.js';
import { createTask, createTestApp, UNKNOWN_ID } from './helpers.js';

describe('DELETE /tasks/:id', () => {
  let app: App;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('remove a tarefa e responde 204 sem corpo', async () => {
    const task = await createTask(app);

    const response = await app.inject({ method: 'DELETE', url: `/tasks/${task.id}` });

    expect(response.statusCode).toBe(204);
    expect(response.body).toBe('');
  });

  it('a tarefa removida deixa de ser encontrada e listada', async () => {
    const removed = await createTask(app, { title: 'Remover' });
    const kept = await createTask(app, { title: 'Manter' });

    await app.inject({ method: 'DELETE', url: `/tasks/${removed.id}` });

    const byId = await app.inject({ method: 'GET', url: `/tasks/${removed.id}` });
    const list = await app.inject({ method: 'GET', url: '/tasks' });

    expect(byId.statusCode).toBe(404);
    expect(list.json()).toEqual([kept]);
  });

  it('responde 404 ao deletar a mesma tarefa duas vezes', async () => {
    const task = await createTask(app);

    await app.inject({ method: 'DELETE', url: `/tasks/${task.id}` });
    const response = await app.inject({ method: 'DELETE', url: `/tasks/${task.id}` });

    expect(response.statusCode).toBe(404);
  });

  it('responde 404 quando a tarefa não existe', async () => {
    const response = await app.inject({ method: 'DELETE', url: `/tasks/${UNKNOWN_ID}` });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Tarefa não encontrada',
    });
  });

  it('responde 400 quando o ID não é um UUID', async () => {
    const response = await app.inject({ method: 'DELETE', url: '/tasks/xyz' });

    expect(response.statusCode).toBe(400);
    expect(response.json().details[0].field).toBe('params.id');
  });
});
