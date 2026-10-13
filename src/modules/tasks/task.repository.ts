import { randomUUID } from 'node:crypto';
import type { CreateTaskInput, Task } from './task.schemas.js';

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
}
