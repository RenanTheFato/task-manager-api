import { randomUUID } from 'node:crypto';
import type { CreateTaskInput, ListTasksFilter, Task } from './task.schemas.js';

/** Persistência em memória: suficiente para o MVP, sem custo de infraestrutura. */
export class TaskRepository {
  private readonly tasks = new Map<string, Task>();

  create(input: CreateTaskInput): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description ?? null,
      completed: input.completed,
      createdAt: now,
      updatedAt: now,
    };
    this.tasks.set(task.id, task);
    return task;
  }

  findAll(filter: ListTasksFilter = {}): Task[] {
    const tasks = [...this.tasks.values()];
    if (filter.completed === undefined) return tasks;
    return tasks.filter((task) => task.completed === filter.completed);
  }

  findById(id: string): Task | undefined {
    return this.tasks.get(id);
  }
}
