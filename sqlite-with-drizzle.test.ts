// To create the database for this, enter the following terminal commands:
// - sqlite3 todo.db
// - create table person(id integer primary key autoincrement, name string);
// - create table todo(id integer primary key autoincrement, description string, completed integer, personId integer);
// - .exit
// To run this, enter `bun test sqlite-with-drizzle.test.ts`.
// To install Drizzle, enter `bun add drizzle-orm` and `bun add -D drizzle-kit`.
import {Database} from 'bun:sqlite';
import {expect, test} from 'bun:test';
import {eq} from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/bun-sqlite';
import {integer, sqliteTable, text} from 'drizzle-orm/sqlite-core';

type Todo = {
  id: number;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

const personTable = sqliteTable('person', {
  id: integer('id').primaryKey({autoIncrement: true}),
  name: text('name').notNull()
});

const todoTable = sqliteTable('todo', {
  // The strings passed to the functions below are the column names.
  id: integer('id').primaryKey({autoIncrement: true}),
  description: text('description').notNull(),
  completed: integer('completed', {mode: 'boolean'}).default(false),
  personId: integer('personId').references(personTable.id)
});

const bunDB = new Database('todo.db', {create: true});
const db = drizzle(bunDB);

async function createPerson(name: string): Promise<number> {
  const results = await db
    .insert(personTable)
    .values({name})
    .returning({id: personTable.id});
  return results[0].id;
}

async function createTodo(
  description: string,
  personId: number
): Promise<number> {
  const results = await db
    .insert(todoTable)
    .values({description, personId})
    .returning({id: todoTable.id});
  return results[0].id;
}

test('sqlite', async () => {
  // Delete all the existing records.
  await db.delete(todoTable);
  await db.delete(personTable);

  const markId = await createPerson('Mark');
  const tamiId = await createPerson('Tami');

  await createTodo('buy milk', tamiId);
  await createTodo('ride bike', tamiId);
  await createTodo('cut grass', markId);
  await createTodo('walk dog', markId);

  // Get all the todo records.
  let todos = db.select().from(todoTable).all();
  expect(todos.length).toBe(4);

  // Get all the todo records for Tami.
  todos = await db
    .select()
    .from(personTable)
    .where(eq(personTable.name, 'Tami'))
    .innerJoin(todoTable, eq(personTable.id, todoTable.personId));
  expect(todos.length).toBe(2);
  expect(todos[0].todo.description).toBe('buy milk');
  expect(todos[1].todo.description).toBe('ride bike');

  /*
  let [firstTodo] = todos;
  expect(firstTodo.description).toBe(description);
  expect(firstTodo.completed).toBe(false);

  // Update the completed status of the todo.
  await db
    .update(todoTable)
    .set({completed: true})
    .where(eq(todoTable.id, id));

  // Verify that the update worked.
  // The select method returns all columns when no columns are specified.
  // TODO: Is there a better way to get just the first matching record?
  todos = await db
    .select()
    // .select({completed: todoTable.completed})
    .from(todoTable)
    .where(eq(todoTable.id, id))
    .all();
  [firstTodo] = todos;
  expect(firstTodo.completed).toBe(true);

  // Delete the new record.
  await db.delete(todoTable).where(eq(todoTable.id, id));

  // Verify that the table is now empty.
  todos = db.select().from(todoTable).all();
  expect(todos.length).toBe(0);
  */

  // TODO: Try implementing a join.
});
