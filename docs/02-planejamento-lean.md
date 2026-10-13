# 2. Planejamento Lean: MVP e backlog

## Problema e cliente

**Cliente:** uma pessoa (ou um front-end/app que a represente) que precisa organizar o que tem para fazer.
**Problema central:** registrar tarefas e acompanhar o que está pendente e o que já foi concluído.

## MVP

O menor conjunto de funcionalidades que resolve o problema central:

| Funcionalidade | Endpoint | Valor ao cliente |
|---|---|---|
| Criar tarefa | `POST /tasks` | Sem isso não existe produto |
| Visualizar tarefas | `GET /tasks`, `GET /tasks/:id` | Ver o que precisa ser feito (com filtro pendente/concluída) |
| Atualizar tarefa | `PATCH /tasks/:id` | Marcar como concluída e corrigir dados |
| Deletar tarefa | `DELETE /tasks/:id` | Manter a lista limpa |

Decisões técnicas enxutas:

- **Persistência em memória:** evita banco, migrações e infraestrutura. Atrás de um repositório (`TaskRepository`), pode ser trocada por SQLite sem mexer nas rotas (decidir o mais tarde possível).
- **Zod nas rotas:** um único schema valida a entrada, tipa o código e garante o formato da saída (qualidade embutida, menos defeitos).

## Fora do MVP (desperdício evitado)

| Funcionalidade | Por que ficou fora |
|---|---|
| Autenticação/usuários | Não é necessária para validar o valor central; adiciona complexidade de segurança e sessão |
| Categorias/tags | Organização secundária; nenhum cliente pediu ainda (superprodução) |
| Notificações/lembretes | Exige infraestrutura extra (filas, e-mail) sem validação de demanda |
| Prazos e prioridades na tarefa | Úteis, mas não essenciais para registrar e concluir tarefas |
| Paginação e ordenação avançada | Volume do MVP é pequeno; otimização prematura |
| Banco de dados persistente | Em memória basta para demonstrar e validar; trocar depois é barato |
| Front-end | O valor do trabalho é a API e o processo ágil |

Esses itens são **hipóteses para próximos ciclos de Build-Measure-Learn**, e não trabalho antecipado.

## Backlog (GitHub Issues)

Milestone de todas as issues: **MVP v1.0** (prazo 17/10/2026). Estimativa em story points (Fibonacci).

### #1 Configurar projeto base (Fastify + Zod + TypeScript + Vitest)

- **Labels:** `chore`, `prioridade: alta`. **Estimativa:** 3
- **Descrição:** criar a estrutura inicial do projeto para que as funcionalidades possam ser entregues.
- **Critérios de aceite:**
  - [ ] `package.json` com scripts `dev`, `build`, `start`, `test`, `typecheck`
  - [ ] TypeScript em modo `strict`
  - [ ] Fastify com `fastify-type-provider-zod` (validator e serializer)
  - [ ] Rota `GET /health` respondendo `{ "status": "ok" }`
  - [ ] Tratamento de erros padronizado (`statusCode`, `error`, `message`, `details`)
  - [ ] Vitest configurado com teste usando `app.inject()`
  - [ ] Diretórios `src/` e `test/`, `.gitignore` e README
  - [ ] Templates de issue e de PR

### #2 Configurar testes automatizados e integração contínua (GitHub Actions)

- **Labels:** `ci`, `test`, `prioridade: alta`. **Estimativa:** 2
- **Descrição:** rodar typecheck, testes e build a cada push e PR, para detectar defeitos cedo.
- **Critérios de aceite:**
  - [ ] Workflow `.github/workflows/ci.yml` em push e pull request
  - [ ] Etapas: `npm ci`, `typecheck`, `test`, `build`
  - [ ] Badge de status do CI no README
  - [ ] PR só é mergeado com CI verde

### #3 Criar endpoint para adicionar uma nova tarefa

- **Labels:** `feature`, `prioridade: alta`. **Estimativa:** 3
- **História:** como usuário, quero cadastrar uma tarefa para não esquecer o que preciso fazer.
- **Critérios de aceite:**
  - [ ] `POST /tasks` com `title` (obrigatório, 1 a 120), `description` (opcional, até 500), `completed` (opcional, padrão `false`)
  - [ ] Responde `201` com `id` (UUID), `createdAt` e `updatedAt`
  - [ ] Responde `400` no formato padrão para dados inválidos ou JSON malformado
  - [ ] Testes de sucesso e de erro

### #4 Criar endpoint para listar tarefas

- **Labels:** `feature`, `prioridade: alta`. **Estimativa:** 3
- **História:** como usuário, quero ver minhas tarefas (todas, pendentes ou concluídas) e consultar uma específica.
- **Critérios de aceite:**
  - [ ] `GET /tasks` responde `200` com a lista na ordem de criação
  - [ ] Filtro opcional `?completed=true|false` (validado por Zod)
  - [ ] `GET /tasks/:id` responde `200` ou `404`; ID inválido responde `400`
  - [ ] Testes de sucesso e de erro

### #5 Criar endpoint para atualizar uma tarefa

- **Labels:** `feature`, `prioridade: média`. **Estimativa:** 3
- **História:** como usuário, quero marcar uma tarefa como concluída e corrigir seus dados.
- **Critérios de aceite:**
  - [ ] `PATCH /tasks/:id` com atualização parcial (`title`, `description`, `completed`)
  - [ ] `description: null` remove a descrição
  - [ ] Exige ao menos um campo; atualiza `updatedAt`
  - [ ] Responde `200`, `400` ou `404`
  - [ ] Testes de sucesso e de erro

### #6 Criar endpoint para deletar uma tarefa

- **Labels:** `feature`, `prioridade: média`. **Estimativa:** 2
- **História:** como usuário, quero remover tarefas que não fazem mais sentido.
- **Critérios de aceite:**
  - [ ] `DELETE /tasks/:id` responde `204` sem corpo
  - [ ] Tarefa removida não aparece mais na listagem nem na busca
  - [ ] Responde `404` se não existir e `400` se o ID for inválido
  - [ ] Testes de sucesso e de erro

### #7 Documentar planejamento Lean, Kanban e checklist de entrega

- **Labels:** `docs`, `prioridade: baixa`. **Estimativa:** 2
- **Descrição:** registrar no repositório a base teórica, o MVP, o backlog, o fluxo Kanban e o checklist dos requisitos.
- **Critérios de aceite:**
  - [ ] Pasta `docs/` com os 4 documentos, linkados no README

## Ordem de priorização e raciocínio

| Ordem | Issue | Prioridade | Pontos | Raciocínio |
|---|---|---|---|---|
| 1 | #1 Setup | Alta | 3 | Habilitador: sem ele nada é entregue |
| 2 | #2 CI | Alta | 2 | Qualidade embutida desde o início; barato agora, caro depois |
| 3 | #3 Criar | Alta | 3 | Maior valor: sem criar, não há o que ver, editar ou deletar |
| 4 | #4 Listar | Alta | 3 | Completa o ciclo mínimo útil (registrar + consultar) |
| 5 | #5 Atualizar | Média | 3 | Concluir tarefas é o objetivo do usuário |
| 6 | #6 Deletar | Média | 2 | Útil, mas o produto já gera valor sem ele |
| 7 | #7 Docs | Baixa | 2 | Suporta a avaliação; não altera o produto |

**Total:** 18 pontos. Critério: **valor ao cliente ÷ esforço**, respeitando as dependências técnicas (#1 → #2 → #3 → demais).
