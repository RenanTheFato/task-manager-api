import { randomUUID } from 'node:crypto';
import type {
  CreateTaskInput,
  ListTasksFilter,
  Task,
  UpdateTaskInput,
} from './task.schemas.js';

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

  update(id: string, input: UpdateTaskInput): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updated: Task = {
      ...task,
      title: input.title ?? task.title,
      description: input.description === undefined ? task.description : input.description,
      completed: input.completed ?? task.completed,
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.tasks.delete(id);
  }
}
