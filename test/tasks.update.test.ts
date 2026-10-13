import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { App } from '../src/app.js';
import { createTask, createTestApp, UNKNOWN_ID } from './helpers.js';

describe('PATCH /tasks/:id', () => {
  let app: App;

  beforeEach(async () => {
    app = await createTestApp();
  });

  afterEach(async () => {
    vi.useRealTimers();
    await app.close();
  });

  it('marca a tarefa como concluída sem alterar os demais campos', async () => {
    const task = await createTask(app, { title: 'Escrever testes', description: 'Vitest' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: { completed: true },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: task.id,
      title: 'Escrever testes',
      description: 'Vitest',
      completed: true,
      createdAt: task.createdAt,
    });
  });

  it('atualiza título e descrição e persiste a alteração', async () => {
    const task = await createTask(app, { title: 'Antigo' });

    await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: { title: 'Novo', description: 'Nova descrição' },
    });
    const response = await app.inject({ method: 'GET', url: `/tasks/${task.id}` });

    expect(response.json()).toMatchObject({ title: 'Novo', description: 'Nova descrição' });
  });

  it('remove a descrição quando recebe null', async () => {
    const task = await createTask(app, { title: 'Tarefa', description: 'Remover' });

    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: { description: null },
    });

    expect(response.json().description).toBeNull();
  });

  it('atualiza o campo updatedAt', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-13T10:00:00.000Z'));
    const task = await createTask(app);

    vi.setSystemTime(new Date('2026-10-13T11:00:00.000Z'));
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: { completed: true },
    });

    expect(response.json()).toMatchObject({
      createdAt: '2026-10-13T10:00:00.000Z',
      updatedAt: '2026-10-13T11:00:00.000Z',
    });
  });

  it('responde 400 quando nenhum campo é enviado', async () => {
    const task = await createTask(app);

    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: {},
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details).toEqual([
      { field: 'body', message: 'Informe ao menos um campo para atualizar' },
    ]);
  });

  it('responde 400 quando o título fica vazio', async () => {
    const task = await createTask(app);

    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${task.id}`,
      payload: { title: '' },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details).toEqual([
      { field: 'body.title', message: 'O título é obrigatório' },
    ]);
  });

  it('responde 404 quando a tarefa não existe', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/tasks/${UNKNOWN_ID}`,
      payload: { completed: true },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json().message).toBe('Tarefa não encontrada');
  });

  it('responde 400 quando o ID não é um UUID', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/tasks/123',
      payload: { completed: true },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details[0].field).toBe('params.id');
  });
});
