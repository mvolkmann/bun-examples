// To run this, enter `bun test sqlite.test.ts`.
import {Database} from 'bun:sqlite';
import {expect, test} from 'bun:test';

type Todo = {
  id: number;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

const db = new Database('todos.db', {create: true});
const deleteAllTodosPS = db.prepare('delete from todos');
const deleteTodoPS = db.prepare('delete from todos where id = ?');
const getTodoQuery = db.query('select * from todos where id = ?');
const getAllTodosQuery = db.query('select * from todos;');
const insertTodoQuery = db.query(
  'insert into todos (description, completed) values (?, 0) returning id'
);
const updateTodoPS = db.prepare('update todos set completed=? where id = ?');

test('sqlite', async () => {
  deleteAllTodosPS.run();

  const description = 'buy milk';
  const {id} = insertTodoQuery.get(description) as {id: number};
  // console.log('id =', id);
  expect(id).toBeGreaterThan(0);

  let todos = getAllTodosQuery.all() as Todo[];
  expect(todos.length).toBe(1);
  let [todo] = todos;
  expect(todo.description).toBe(description);

  updateTodoPS.run(1, todo.id);

  todo = getTodoQuery.get(todo.id) as Todo;
  expect(todo.completed).toBe(1);

  deleteTodoPS.run(todo.id);

  todos = getAllTodosQuery.all() as Todo[];
  expect(todos.length).toBe(0);
});
