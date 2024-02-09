// To create the database for this, enter:
// - bun migrate:gen
// - bun migrate:push (and select "Yes")
// To run this, enter `bun test`.
import {Database, SQLiteError} from 'bun:sqlite';
import {expect, test} from 'bun:test';
import {eq} from 'drizzle-orm';
import {drizzle} from 'drizzle-orm/bun-sqlite';
import {personTable, todoTable} from './schema';

const bunDB = new Database('todo.db', {create: true});
const db = drizzle(bunDB);

/**
 * This creates a row in the person table
 * and returns the id of the new row.
 * @param name {string}
 * @returns {number} id of new row
 */
async function createPerson(name: string): Promise<number> {
  const results = await db
    .insert(personTable)
    .values({name})
    .returning({id: personTable.id});
  return results[0].id;
}

/**
 * This creates a row in the todo table
 * and returns the id of the new row.
 * @param description {string}
 * @param personId {number} id of a person record
 * @returns {number} id of new row
 */
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

  // Create new records.
  const markId = await createPerson('Mark');
  const tamiId = await createPerson('Tami');
  await createTodo('buy milk', tamiId);
  await createTodo('ride bike', tamiId);
  await createTodo('cut grass', markId);
  await createTodo('walk dog', markId);

  // Attempt to add a duplicate todo that violates
  // the unique constraint specified in db/schema.ts.
  // This throws
  // "SQLiteError: UNIQUE constraint failed: todo.description".
  expect(() => createTodo('walk dog', tamiId)).toThrow(SQLiteError);

  // Get all the todo records.
  // The select method returns all columns when no columns are specified.
  let todos = db.select().from(todoTable).all();
  expect(todos.length).toBe(4);

  // Get all the todo records for Tami.
  const joins = await db
    .select()
    .from(personTable)
    .where(eq(personTable.name, 'Tami'))
    .innerJoin(todoTable, eq(personTable.id, todoTable.personId));
  expect(joins.length).toBe(2);
  const [join1, join2] = joins;
  expect(join1.person.name).toBe('Tami');
  expect(join1.todo.description).toBe('buy milk');
  expect(join1.todo.completed).toBe(false);
  expect(join2.todo.description).toBe('ride bike');

  // Update the completed status of the first todo.
  const {id} = join1.todo;
  await db.update(todoTable).set({completed: true}).where(eq(todoTable.id, id));

  // Verify that the update worked.
  // TODO: Is there a better way to get just the first matching record?
  const completedValues = await db
    .select({completed: todoTable.completed})
    .from(todoTable)
    .where(eq(todoTable.id, id))
    .all();
  expect(completedValues[0].completed).toBe(true);

  // Delete the new record.
  await db.delete(todoTable).where(eq(todoTable.id, id));

  // Verify that the delete worked.
  const results = await db.select().from(todoTable).where(eq(todoTable.id, id));
  expect(results.length).toBe(0);
});
