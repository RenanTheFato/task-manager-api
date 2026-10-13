import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { App } from '../src/app.js';
import { createTestApp } from './helpers.js';

describe('POST /tasks', () => {
  let app: App;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it('cria uma tarefa e responde 201 com os dados gerados', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { title: 'Estudar Kanban', description: 'Ler sobre limite de WIP' },
    });

    expect(response.statusCode).toBe(201);
    const task = response.json();
    expect(task).toMatchObject({
      title: 'Estudar Kanban',
      description: 'Ler sobre limite de WIP',
      completed: false,
    });
    expect(task.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Date(task.createdAt).toISOString()).toBe(task.createdAt);
    expect(task.updatedAt).toBe(task.createdAt);
  });

  it('aceita tarefa sem descrição e com completed informado', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { title: 'Revisar PR', completed: true },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      title: 'Revisar PR',
      description: null,
      completed: true,
    });
  });

  it('remove espaços nas pontas do título', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { title: '   Planejar sprint   ' },
    });

    expect(response.json().title).toBe('Planejar sprint');
  });

  it('responde 400 quando o título não é enviado', async () => {
    const response = await app.inject({ method: 'POST', url: '/tasks', payload: {} });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Dados da requisição inválidos',
      details: [{ field: 'body.title', message: 'O título é obrigatório' }],
    });
  });

  it('responde 400 quando o título é vazio ou só espaços', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { title: '   ' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details).toEqual([
      { field: 'body.title', message: 'O título é obrigatório' },
    ]);
  });

  it('responde 400 quando o título passa de 120 caracteres', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { title: 'a'.repeat(121) },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details[0].field).toBe('body.title');
  });

  it('responde 400 quando completed não é booleano', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { title: 'Tarefa', completed: 'sim' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details).toEqual([
      { field: 'body.completed', message: 'completed deve ser booleano' },
    ]);
  });

  it('responde 400 quando o JSON é malformado', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/tasks',
      headers: { 'content-type': 'application/json' },
      payload: '{"title":',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ statusCode: 400, error: 'Bad Request' });
  });
});
