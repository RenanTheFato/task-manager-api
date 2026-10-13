# 3. Kanban e fluxo de trabalho

## Quadro no GitHub Projects

Projeto: **task-manager-api – Kanban** (visibilidade pública, vinculado ao repositório).

| Coluna | Significado | Entra quando | Limite de WIP |
|---|---|---|---|
| **Backlog** | Priorizado, pronto para ser puxado | A issue é criada (automação) | Sem limite |
| **Em progresso** | Alguém está desenvolvendo | O dev se atribui e cria a branch | 1 por pessoa (máx. 4) |
| **Em revisão** | PR aberto aguardando CI e revisão | O PR com `Closes #n` é aberto | 3 |
| **Concluído** | Mergeado na `main`, issue fechada | Merge do PR (automação) | — |

### Como configurar (passo a passo)

1. No perfil do GitHub: **Projects → New project → Board**. Nome: `task-manager-api – Kanban`.
2. No campo **Status** (`⋯` da coluna → *Edit*), renomeie e crie as opções nesta ordem: `Backlog`, `Em progresso`, `Em revisão`, `Concluído`.
3. Em cada coluna, use `⋯ → Set limit` para definir o WIP: Em progresso = 4, Em revisão = 3.
4. Crie os campos **Prioridade** (single select: Alta, Média, Baixa) e **Estimativa** (number).
5. **Settings → Visibility → Public**.
6. **⋯ → Workflows** e ative:
   - *Item added to project* → Status = **Backlog**
   - *Auto-add to project* → filtro `is:issue is:open` no repositório `task-manager-api`
   - *Item reopened* → Status = **Em progresso**
   - *Item closed* → Status = **Concluído**
   - *Pull request merged* → Status = **Concluído**
7. No repositório: **Projects → Link a project** e selecione o quadro.

A movimentação de **Backlog → Em progresso** e de **Em progresso → Em revisão** é manual. Ela representa o momento em que a pessoa **puxa** o trabalho, e fazer isso ao vivo na demonstração mostra o fluxo puxado.

## Regras do quadro (políticas explícitas)

1. **Fluxo puxado:** ao ficar livre, a pessoa puxa a issue de maior prioridade do Backlog cujas dependências estejam concluídas.
2. **WIP:** no máximo **1** issue por pessoa em "Em progresso". Se "Em revisão" atingir 3, a próxima ação é revisar, não começar algo novo ("pare de começar, comece a terminar").
3. **Branch por issue:** `tipo/<nº>-descricao` a partir da `main`.
4. **Commits pequenos e frequentes** em Conventional Commits, com `Refs #n`.
5. **PR obrigatório**, com `Closes #n` na descrição e revisão de outro integrante.
6. **Merge só com CI verde.**

### Definição de Pronto

- [ ] Critérios de aceite da issue atendidos
- [ ] Schemas Zod de entrada e saída
- [ ] Testes Vitest cobrindo sucesso e erro
- [ ] `npm run typecheck` e `npm test` passando
- [ ] CI verde
- [ ] PR revisado e mergeado na `main`
- [ ] README atualizado, se necessário

## Conventional Commits

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `test` | Testes |
| `docs` | Documentação |
| `ci` | Pipeline de integração contínua |
| `chore` | Configuração e manutenção |

Exemplo: `feat(tasks): cria endpoint POST /tasks para adicionar tarefa` + rodapé `Refs #3`.

## Branches e issues

| Issue | Branch |
|---|---|
| #1 Configurar projeto base | `chore/1-setup-projeto` |
| #2 Testes e integração contínua | `ci/2-integracao-continua` |
| #3 Adicionar tarefa | `feat/3-criar-tarefa` |
| #4 Listar tarefas | `feat/4-listar-tarefas` |
| #5 Atualizar tarefa | `feat/5-atualizar-tarefa` |
| #6 Deletar tarefa | `feat/6-deletar-tarefa` |
| #7 Documentação ágil | `docs/7-documentacao-agil` |

## Divisão entre os integrantes (sugestão para 4 pessoas)

| Integrante | Papel ágil | Issues | Revisa PRs de |
|---|---|---|---|
| Integrante 1 | Product Owner | #1 Setup, #7 Docs | Integrante 2 |
| Integrante 2 | Dev | #2 CI, #3 Criar | Integrante 3 |
| Integrante 3 | Dev | #4 Listar, #5 Atualizar | Integrante 4 |
| Integrante 4 | Facilitador (Scrum Master) | #6 Deletar | Integrante 1 |

Todos revisam e todos têm ao menos um PR mergeado. Assim, cada integrante aparece no histórico de commits e de revisões.

## Ciclo de uma issue

```
Backlog ─► (atribui + cria branch) ─► Em progresso ─► (commits pequenos, push → CI)
        ─► (abre PR "Closes #n") ─► Em revisão ─► (CI verde + aprovação + merge) ─► Concluído
```
