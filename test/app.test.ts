import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { buildApp, type App } from '../src/app.js';

describe('Aplicação', () => {
  let app: App;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health responde 200 com status ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: 'ok' });
  });

  it('rota inexistente responde 404 no formato padronizado de erro', async () => {
    const response = await app.inject({ method: 'GET', url: '/nao-existe' });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({
      statusCode: 404,
      error: 'Not Found',
      message: 'Rota GET /nao-existe não encontrada',
    });
  });
});
