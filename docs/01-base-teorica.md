# 1. Base teórica: GitHub Issues, GitHub Projects, Lean, Kanban e Scrum

## GitHub Issues

O GitHub Issues é o sistema de registro de trabalho do repositório. Cada issue é uma unidade de trabalho (funcionalidade, bug ou tarefa técnica), tem número único (`#1`, `#2`…), discussão própria e histórico. **Neste projeto, as issues abertas são o backlog do produto.**

| Elemento | Para que serve | Uso neste projeto |
|---|---|---|
| Título + descrição | O que fazer e por quê (Markdown, checklists) | História de usuário e critérios de aceite |
| Labels | Classificar por tipo, prioridade e área | `feature`, `chore`, `ci`, `test`, `docs`, `prioridade: alta/média/baixa` |
| Assignees | Responsável pela issue | Cada integrante puxa a sua |
| Milestones | Agrupar issues em um marco com prazo e progresso | **MVP v1.0**, com prazo em 17/10/2026 |
| Templates | Padronizar a abertura de issues (`.github/ISSUE_TEMPLATE/`) | Formulários "Funcionalidade" e "Tarefa técnica" |

### Vínculo entre issues, commits e PRs

- Citar `#3` em um commit ou PR cria um link que aparece na timeline da issue.
- As palavras-chave `close(s|d)`, `fix(es|ed)` e `resolve(s|d)` seguidas de `#n` (ex.: `Closes #3`) **fecham a issue automaticamente** quando o PR é mergeado na branch padrão.
- Convenção adotada: os **commits** usam `Refs #n` (só referenciam) e a **descrição do PR** usa `Closes #n` (fecha no merge).

Rastreabilidade obtida: **issue → branch → commits → PR → CI → merge → issue fechada → card em Concluído**.

## GitHub Projects

O GitHub Projects é uma ferramenta de planejamento alimentada pelas issues e PRs, vinculada ao repositório.

- **Views:** Table (planilha), Board (Kanban) e Roadmap (linha do tempo).
- **Campo `Status`:** cada opção vira uma coluna do Board. Aqui as colunas são **Backlog / Em progresso / Em revisão / Concluído**.
- **Campos personalizados:** Prioridade (single select) e Estimativa (number).
- **Limite de coluna:** limite de WIP visual no Board.
- **Workflows (automações):** item adicionado → Backlog; PR mergeado ou issue fechada → Concluído; issue reaberta → Em progresso; auto-add de novas issues do repositório.

## Lean

Princípios do Lean Software Development (Poppendieck): eliminar desperdício, amplificar o aprendizado, decidir o mais tarde possível, entregar o mais rápido possível, dar autonomia ao time, embutir qualidade e otimizar o todo.

### Os 7 desperdícios aplicados a software

| Manufatura | Software | Como evitamos |
|---|---|---|
| Estoque | Trabalho parcialmente pronto | Limite de WIP; PRs pequenos e mergeados rápido |
| Superprodução | Funcionalidades extras | MVP só com CRUD (ver [planejamento](02-planejamento-lean.md)) |
| Processamento extra | Reaprendizado | README, templates e critérios de aceite documentados |
| Transporte | Passagens de bastão | Quem pega a issue leva até o fim (código + teste + PR) |
| Movimento | Troca de contexto | Uma issue por pessoa por vez |
| Espera | Atrasos | Revisão rápida de PR; CI dá feedback em minutos |
| Defeitos | Defeitos | Validação com Zod + testes Vitest + CI em todo push/PR |

### MVP e Build-Measure-Learn

- **MVP:** a menor versão do produto que entrega valor real e permite aprender. Aqui, é o CRUD de tarefas.
- **Construir → Medir → Aprender (Eric Ries):** construir o mínimo, medir o uso/feedback e decidir o próximo passo. O que ficou fora do MVP vira hipótese para depois, e não trabalho antecipado.

## Kanban

- **Visualizar o fluxo:** quadro do GitHub Projects.
- **Limitar o WIP:** 1 item por pessoa em "Em progresso"; no máximo 3 em "Em revisão".
- **Fluxo puxado:** quem termina **puxa** o próximo item de maior prioridade; ninguém empurra tarefas.
- **Políticas explícitas:** Definição de Pronto e critérios de transição entre colunas.
- **Gerenciar o fluxo:** observar gargalos (ex.: cards acumulando em revisão).

## Scrum

- **Product Backlog** ordenado por valor: issues com prioridade.
- **Incremento:** o milestone MVP v1.0 é um incremento entregável.
- **Definition of Done:** checklist do template de PR.
- **Papéis:** Product Owner (prioriza o backlog) e facilitador (remove impedimentos).

## Como tudo se conecta

| Conceito | Papel | Ferramenta |
|---|---|---|
| Lean | Decide **o que** fazer (só o que gera valor) | Escopo do MVP |
| Scrum | Organiza **backlog e entrega** | Issues + Milestone + DoD |
| Kanban | Controla o **fluxo diário** | GitHub Projects (Board) |
| Integração contínua | Garante **qualidade** a cada mudança | GitHub Actions + Vitest |
