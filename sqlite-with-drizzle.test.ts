// To run this, enter `bun test sqlite-with-drizzle.test.ts`.
// To install Drizzle, enter `bun add drizzle-orm` and `bun add -D drizzle-kit`.
import {Database} from 'bun:sqlite';
import {expect, test} from 'bun:test';
import {eq, sql} from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/bun-sqlite';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

type Todo = {
  id: number;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

const todosTable = sqliteTable('todos', {
  // The strings passed to the functions below are the column names.
  id: integer('id').primaryKey({autoIncrement: true}),
  description: text('description').notNull(),
  completed: integer('completed', {mode: 'boolean'}).default(false)
});

const bunDB = new Database('todos.db', {create: true});
const db = drizzle(bunDB);

test('sqlite', async () => {
  // Delete all the existing records.
  await db.delete(todosTable);

  // Insert a record into the todos table.
  const description = 'buy milk';
  const results = await db
    .insert(todosTable)
    .values({description})
    .returning({id: todosTable.id});
  const id = results[0].id;
  expect(id).toBeGreaterThan(0);

  // Get all the todo records.
  let todos = db.select().from(todosTable).all();
  expect(todos.length).toBe(1);
  let [firstTodo] = todos;
  expect(firstTodo.description).toBe(description);
  expect(firstTodo.completed).toBe(false);

  // Update the completed status of the todo.
  await db
    .update(todosTable)
    .set({completed: true})
    .where(eq(todosTable.id, id));

  // Verify that the update worked.
  // TODO: Is there a better way to get just the first matching record?
  todos = await db.select().from(todosTable).where(eq(todosTable.id, id)).all();
  [firstTodo] = todos;
  expect(firstTodo.completed).toBe(true);

  // Delete the new record.
  await db.delete(todosTable).where(eq(todosTable.id, id));

  // Verify that the table is now empty.
  todos = db.select().from(todosTable).all();
  expect(todos.length).toBe(0);

  // TODO: Try implementing a join.
});
