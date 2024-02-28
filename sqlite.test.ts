// To run this, enter `bun test sqlite.test.ts`.
import {Database} from 'bun:sqlite';
import {expect, test} from 'bun:test';

type Todo = {
  id: number;
  text: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

const db = new Database('todos.db');
const deleteAllTodosPS = db.prepare('delete from todos');
const deleteTodoPS = db.prepare('delete from todos where id = ?');
const getTodoQuery = db.query('select * from todos where id = ?');
const getAllTodosQuery = db.query('select * from todos;');
const insertTodoQuery = db.query(
  'insert into todos (text, completed) values (?, 0) returning id'
);
const updateTodoPS = db.prepare('update todos set completed=? where id = ?');

test('sqlite', () => {
  deleteAllTodosPS.run();

  const text = 'buy milk';
  const {id} = insertTodoQuery.get(text) as {id: number};
  expect(id).toBeGreaterThan(0);

  let todos = getAllTodosQuery.all() as Todo[];
  expect(todos.length).toBe(1);
  let [todo] = todos;
  expect(todo.text).toBe(text);

  updateTodoPS.run(1, todo.id);

  todo = getTodoQuery.get(todo.id) as Todo;
  expect(todo.completed).toBe(1);

  deleteTodoPS.run(todo.id);

  todos = getAllTodosQuery.all() as Todo[];
  expect(todos.length).toBe(0);
});
