# 4. Checklist de entrega

Repositório: **https://github.com/RenanTheFato/task-manager-api**
Quadro Kanban: **GitHub → aba Projects do repositório → task-manager-api – Kanban**

| # | Requisito do professor | Evidência | OK |
|---|---|---|---|
| 0 | Pesquisa sobre GitHub Issues e Projects | [docs/01-base-teorica.md](01-base-teorica.md) | [ ] |
| 1.1 | Repositório público `task-manager-api` | Settings → General → visibilidade *Public* | [ ] |
| 1.2 | Membros do grupo como colaboradores | Settings → Collaborators (convites **aceitos**) | [ ] |
| 1.3 | README com descrição, propósito e tecnologias | [README.md](../README.md) | [ ] |
| 1.4 | Diretório `src` (código) | [src/](../src) | [ ] |
| 1.5 | Diretório `test` (testes automatizados) | [test/](../test), com 30 testes Vitest | [ ] |
| 2.1 | MVP definido (CRUD de tarefas) | [docs/02-planejamento-lean.md](02-planejamento-lean.md#mvp) | [ ] |
| 2.2 | Backlog no GitHub Issues, uma issue por funcionalidade | Issues #1 a #7 com labels, milestone e critérios de aceite | [ ] |
| 2.3 | Priorização por valor e eliminação de desperdício | Seções "Fora do MVP" e "Ordem de priorização" | [ ] |
| 3.1 | GitHub Projects com Backlog, Em progresso, Em revisão e Concluído | Board do projeto + automações ativas | [ ] |
| 3.2 | Issues movimentadas conforme o progresso | Histórico de cada card (atividade da issue) | [ ] |
| 3.3 | Desenvolvimento iterativo e incremental | Uma branch e um PR por issue, mergeados em sequência | [ ] |
| 3.4 | Commits pequenos e frequentes | `git log --oneline` / aba Commits (Conventional Commits) | [ ] |
| 3.5 | Integração contínua | Aba Actions: workflow CI verde em cada PR; badge no README | [ ] |

## Conferência rápida antes do seminário (17/10/2026)

- [ ] Abrir o link do repositório em uma janela anônima e confirmar que tudo está visível (repo e Project)
- [ ] Todos os colaboradores aceitaram o convite
- [ ] Todas as issues do MVP estão fechadas e em **Concluído**
- [ ] Último run do CI na `main` está verde
- [ ] `npm install && npm test` funciona em um clone limpo
- [ ] Link do repositório enviado para quem está fazendo os slides
