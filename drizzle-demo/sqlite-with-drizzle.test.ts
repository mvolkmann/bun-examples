// To create the database for this, enter:
// - bun migrate:gen
// - bun migrate:push (and select "Yes")
// To run this, enter `bun test`.
import {Database} from 'bun:sqlite';
import {expect, test} from 'bun:test';
import {eq} from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/bun-sqlite';
import {
  personTable,
  Person,
  InsertPerson,
  todoTable,
  Todo,
  InsertTodo
} from './db/schema';

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
  const [todo1, todo2] = todos;
  expect(todo1.person.name).toBe('Tami');
  expect(todo1.todo.description).toBe('buy milk');
  expect(todo1.todo.completed).toBe(false);
  expect(todo2.todo.description).toBe('ride bike');

  // Update the completed status of the first todo.
  const {id} = todo1.todo;
  await db.update(todoTable).set({completed: true}).where(eq(todoTable.id, id));

  // Verify that the update worked.
  // The select method returns all columns when no columns are specified.
  // TODO: Is there a better way to get just the first matching record?
  todos = await db
    .select()
    // .select({completed: todoTable.completed})
    .from(todoTable)
    .where(eq(todoTable.id, id))
    .all();
  expect(todos[0].completed).toBe(true);

  // Delete the new record.
  await db.delete(todoTable).where(eq(todoTable.id, id));

  // Verify that the delete worked.
  // todos = db.select().from(todoTable).where(eq(todoTable.id, id)).all();
  const result = await db.select().from(todoTable).where(eq(todoTable.id, id));
  expect(result.length).toBe(0);
});
