import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { App } from '../src/app.js';
import { createTask, createTestApp, UNKNOWN_ID } from './helpers.js';

describe('GET /tasks', () => {
  let app: App;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('responde 200 com lista vazia quando não há tarefas', async () => {
    const response = await app.inject({ method: 'GET', url: '/tasks' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([]);
  });

  it('lista todas as tarefas na ordem de criação', async () => {
    const first = await createTask(app, { title: 'Primeira' });
    const second = await createTask(app, { title: 'Segunda', completed: true });

    const response = await app.inject({ method: 'GET', url: '/tasks' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual([first, second]);
  });

  it('filtra por tarefas concluídas e pendentes', async () => {
    const pending = await createTask(app, { title: 'Pendente' });
    const done = await createTask(app, { title: 'Concluída', completed: true });

    const completed = await app.inject({ method: 'GET', url: '/tasks?completed=true' });
    const notCompleted = await app.inject({ method: 'GET', url: '/tasks?completed=false' });

    expect(completed.json()).toEqual([done]);
    expect(notCompleted.json()).toEqual([pending]);
  });

  it('responde 400 quando o filtro completed é inválido', async () => {
    const response = await app.inject({ method: 'GET', url: '/tasks?completed=talvez' });

    expect(response.statusCode).toBe(400);
    expect(response.json().details).toEqual([
      { field: 'querystring.completed', message: 'completed deve ser "true" ou "false"' },
    ]);
  });
});

describe('GET /tasks/:id', () => {
  let app: App;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('responde 200 com a tarefa encontrada', async () => {
    const task = await createTask(app, { title: 'Detalhar backlog' });

    const response = await app.inject({ method: 'GET', url: `/tasks/${task.id}` });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual(task);
  });

  it('responde 404 quando a tarefa não existe', async () => {
    const response = await app.inject({ method: 'GET', url: `/tasks/${UNKNOWN_ID}` });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Tarefa não encontrada',
    });
  });

  it('responde 400 quando o ID não é um UUID', async () => {
    const response = await app.inject({ method: 'GET', url: '/tasks/abc' });

    expect(response.statusCode).toBe(400);
    expect(response.json().details).toEqual([
      { field: 'params.id', message: 'O ID deve ser um UUID válido' },
    ]);
  });
});
