# task-manager-api

[![CI](https://github.com/RenanTheFato/task-manager-api/actions/workflows/ci.yml/badge.svg)](https://github.com/RenanTheFato/task-manager-api/actions/workflows/ci.yml)

API REST para gerenciamento de tarefas, desenvolvida como trabalho em grupo da disciplina de **Gestão Ágil**. O projeto aplica práticas **Lean**, **Kanban** e **Scrum** usando **GitHub Issues** (backlog) e **GitHub Projects** (quadro Kanban).

## Propósito

Entregar um **MVP (Produto Mínimo Viável)** que resolve o problema central do usuário, que é registrar e acompanhar suas tarefas, com o mínimo de esforço e sem desperdício:

- **Criar** uma tarefa
- **Visualizar** tarefas (listar todas, filtrar por status ou buscar por ID)
- **Atualizar** uma tarefa (título, descrição ou conclusão)
- **Deletar** uma tarefa

Autenticação, categorias, notificações, prazos e paginação ficaram **fora do MVP** de propósito (desperdício evitado). A justificativa está em [docs/02-planejamento-lean.md](docs/02-planejamento-lean.md).

## Tecnologias

| Tecnologia | Uso |
|---|---|
| [Node.js](https://nodejs.org/) (>= 20) | Runtime |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Fastify](https://fastify.dev/) | Framework HTTP |
| [Zod](https://zod.dev/) + [fastify-type-provider-zod](https://github.com/turkerdev/fastify-type-provider-zod) | Validação e tipagem de body, params, querystring e response |
| [Vitest](https://vitest.dev/) | Testes automatizados (com `app.inject()` do Fastify) |
| [GitHub Actions](https://github.com/features/actions) | Integração contínua (testes a cada push/PR) |
| Persistência em memória | Mantém o MVP enxuto (sem banco de dados) |

## Estrutura

```
task-manager-api/
├── .github/
│   ├── ISSUE_TEMPLATE/        # Templates de issue (funcionalidade e tarefa técnica)
│   ├── workflows/ci.yml       # Pipeline de integração contínua
│   └── pull_request_template.md
├── docs/                      # Base teórica, planejamento Lean, Kanban e checklist
├── src/                       # Código da aplicação
│   ├── app.ts                 # Criação e configuração do Fastify
│   ├── server.ts              # Ponto de entrada (sobe o servidor HTTP)
│   ├── errors.ts              # Erros de domínio e formato padronizado de erro
│   └── modules/tasks/
│       ├── task.schemas.ts    # Schemas Zod (entrada e saída)
│       ├── task.repository.ts # Persistência em memória
│       └── task.routes.ts     # Endpoints do CRUD
└── test/                      # Testes automatizados (Vitest)
```

## Como rodar

```bash
git clone https://github.com/RenanTheFato/task-manager-api.git
cd task-manager-api
npm install
npm run dev          # http://localhost:3333 (recarrega ao salvar)
```

Produção:

```bash
npm run build
npm start
```

Variáveis opcionais: `PORT` (padrão `3333`) e `HOST` (padrão `0.0.0.0`).

## Como testar

```bash
npm test               # roda todos os testes uma vez
npm run test:watch     # modo observação
npm run test:coverage  # relatório de cobertura
npm run typecheck      # checagem de tipos do TypeScript
```

Os testes usam `app.inject()` do Fastify para simular as requisições HTTP sem abrir porta de rede.

## Endpoints

| Método | Rota | Descrição | Sucesso |
|---|---|---|---|
| `GET` | `/health` | Verifica se a API está no ar | `200` |
| `POST` | `/tasks` | Cria uma tarefa | `201` |
| `GET` | `/tasks` | Lista as tarefas (filtro opcional `?completed=true\|false`) | `200` |
| `GET` | `/tasks/:id` | Busca uma tarefa pelo ID | `200` |
| `PATCH` | `/tasks/:id` | Atualiza parcialmente uma tarefa | `200` |
| `DELETE` | `/tasks/:id` | Remove uma tarefa | `204` |

### Modelo de tarefa

```json
{
  "id": "6f1c1b4e-2c4a-4f0e-9a51-3f2d8f1f7a10",
  "title": "Estudar Kanban",
  "description": "Ler sobre limite de WIP",
  "completed": false,
  "createdAt": "2026-10-13T12:00:00.000Z",
  "updatedAt": "2026-10-13T12:00:00.000Z"
}
```

Regras de validação (Zod):

- `title`: texto obrigatório, de 1 a 120 caracteres (espaços nas pontas são removidos)
- `description`: texto opcional, até 500 caracteres
- `completed`: booleano (padrão `false` na criação)
- `id`: UUID

### Exemplos

```bash
# Criar
curl -X POST http://localhost:3333/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar Kanban","description":"Ler sobre limite de WIP"}'

# Listar pendentes
curl "http://localhost:3333/tasks?completed=false"

# Buscar por ID
curl http://localhost:3333/tasks/<id>

# Concluir
curl -X PATCH http://localhost:3333/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'

# Deletar
curl -X DELETE http://localhost:3333/tasks/<id>
```

### Formato padronizado de erro

Todos os erros seguem o mesmo formato:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Dados da requisição inválidos",
  "details": [{ "field": "body.title", "message": "O título é obrigatório" }]
}
```

| Status | Quando |
|---|---|
| `400` | Body, params ou querystring inválidos (validação Zod) |
| `404` | Tarefa ou rota não encontrada |
| `500` | Erro inesperado no servidor |

## Fluxo de trabalho do time

O trabalho segue **Kanban** no GitHub Projects, com as colunas **Backlog → Em progresso → Em revisão → Concluído**. Os detalhes estão em [docs/03-kanban-fluxo.md](docs/03-kanban-fluxo.md).

1. **Puxe** a issue de maior prioridade do Backlog, atribua a você e mova para **Em progresso** (WIP: 1 por pessoa).
2. Crie a branch a partir da `main`: `tipo/<nº-da-issue>-descricao-curta` (ex.: `feat/3-criar-tarefa`).
3. Faça **commits pequenos e frequentes** no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/), referenciando a issue (`Refs #3`).
4. Abra um **Pull Request** com `Closes #<nº>` na descrição. O card vai para **Em revisão**.
5. Com o **CI verde** e a **aprovação** de outro integrante, faça o merge. A issue fecha sozinha e o card vai para **Concluído**.

### Definição de Pronto

- Critérios de aceite da issue atendidos
- Schemas Zod de entrada e saída definidos
- Testes automatizados cobrindo sucesso e erro
- CI verde no GitHub Actions
- PR revisado e mergeado na `main`

## Documentação do projeto

- [Base teórica: GitHub Issues, Projects, Lean, Kanban e Scrum](docs/01-base-teorica.md)
- [Planejamento Lean: MVP e backlog](docs/02-planejamento-lean.md)
- [Kanban e fluxo de trabalho](docs/03-kanban-fluxo.md)
- [Checklist de entrega](docs/04-checklist-entrega.md)

## Integrantes

| Nome |
|---|
| Renan Dias Santos de Santana 
| Luan Kaue 
| Arthur Roberto Weege Pontes 
| Douglas Henrique dos Santos Xavier 
| Endrigo 
| Felipe Moreira 
| Guilherme Silveira Fernandes da Silva 
| Igor de Souza Delmondes 

## Licença

MIT
