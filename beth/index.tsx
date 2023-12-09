import {Database} from 'bun:sqlite';
import {Elysia, t} from 'elysia';
import {html} from '@elysiajs/html';
import {staticPlugin} from '@elysiajs/static';
import * as elements from 'typed-html';
import {Attributes} from 'typed-html';

const app = new Elysia();
app.use(html());
app.use(staticPlugin());

const db = new Database('todos.db', {create: true});
const deleteTodoPS = db.prepare('delete from todos where id = ?');
const getTodosQuery = db.query('select * from todos;');
const insertTodoPS = db.prepare(
  'insert into todos (description, completed) values (?, ?)'
);
const updateTodoPS = db.prepare('update todos set completed=? where id = ?');

type Todo = {
  id: string;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

// This is the state.
let nextId = 0;
const todos: Todo[] = [];

function addTodo(description: string) {
  //const todo = {id: nextId++, description, completed: false};
  // todos.push(todo);
  // return todo;
  try {
    const result = insertTodoPS.run(description, 0);
    console.log('index.tsx post: result =', result);
    const id = result.lastInsertRowid as number;
    console.log('index.tsx post: inserted row with id', id);
    return {id, description, completed: 0};
  } catch (e) {
    console.error('index.tsx post: e =', e);
    const isDuplicate = e.toString().includes('UNIQUE constraint failed');
    throw isDuplicate ? new Error('duplicate todo ' + description) : e;
  }
}

// addTodo('buy milk');
// addTodo('cut grass');

//-----------------------------------------------------------------------------

// const BaseHtml = ({children}: elements.Children) => (
const BaseHtml = ({children}: Attributes) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>BETH stack demo</title>
      {/* TODO: Can the staticPlugin default to looking in /public? */}
      <link rel="stylesheet" href="/public/global.css" />
      {/* <script src="https://unpkg.com/htmx.org@1.9.9"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
      <script src="https://cdn.tailwindcss.com"></script> */}
      <script src="public/htmx.min.js"></script>
      <script src="public/hyperscript.min.js"></script>
      <script src="public/tailwind.min.js"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

//-----------------------------------------------------------------------------

function TodoForm() {
  return (
    <form
      class="flex gap-4 my-4"
      hx-post="/todos"
      hx-swap="afterend"
      _="on submit target.reset()" // uses hyperscript
    >
      <input
        class="border border-gray-500 p-1 rounded-lg"
        name="description"
        placeholder="enter new todo here"
        size="30"
      />
      <button type="submit">Add</button>
    </form>
  );
}

//-----------------------------------------------------------------------------

type TodoItemProps = {todo: Todo};
function TodoItem({todo: {id, description, completed}}: TodoItemProps) {
  console.log('index.tsx TodoItem: id =', id);
  return (
    <div class="flex gap-4">
      <input
        type="checkbox"
        checked={completed === 1}
        hx-post={`/todos/toggle/${id}`}
        hx-target="closest div" // can also use a CSS selector
        hx-swap="outerHTML"
      />
      <p class={completed ? 'text-gray-500 line-through' : ''}>{description}</p>
      <button
        hx-delete={`/todos/${id}`}
        hx-swap="outerHTML"
        class="flex gap-4"
        hx-target="closest div"
      >
        🗑
      </button>
    </div>
  );
}

//-----------------------------------------------------------------------------

type TodoListProps = {todos: Todo[]};
function TodoList({todos}: TodoListProps) {
  return (
    <div>
      {todos.map(todo => (
        <TodoItem todo={todo} />
      ))}
    </div>
  );
}

//-----------------------------------------------------------------------------

function TodoStatus() {
  const uncompletedCount = todos.filter(todo => !todo.completed).length;
  return (
    <p id="todo-status" hx-swap-oob="true">
      {uncompletedCount} of {todos.length} remaining
    </p>
  );
}
//-----------------------------------------------------------------------------

// This deletes a given todo.  It is the D in CRUD.
app.delete(
  '/todos/:id',
  ({params}) => {
    // const todo = todos.find(todo => todo.id === params.id);
    // if (todo) {
    //   todos.splice(todos.indexOf(todo), 1);
    // }

    try {
      const result = deleteTodoPS.run(params.id);
      console.log('index.tsx delete: result =', result);
    } catch (e) {
      console.error('index.tsx delete: e =', e);
      throw e;
    }
    // By not returning any HTML for this todo item,
    // we replace the existing todo item with nothing.
    return <TodoStatus />;
  },
  {
    params: t.Object({
      id: t.Numeric()
    })
  }
);

//-----------------------------------------------------------------------------

// This is a basic HTMX demo.
app.get('/', () => (
  <BaseHtml>
    <div class="bg-gray-200 flex w-full h-screen justify-center items-center">
      <button
        class="bg-yellow-200 p-4 rounded-lg border border-black"
        hx-post="/clicked"
        hx-swap="outerHTML"
      >
        Click Me
      </button>
    </div>
  </BaseHtml>
));

//-----------------------------------------------------------------------------

// This renders the todo list UI.  It is the R in CRUD.
app.get('/todos', () => {
  const todos = getTodosQuery.all(); // get();
  console.log('index.tsx get: todos =', todos);

  return (
    <BaseHtml>
      <h2>To Do List</h2>
      <TodoStatus />
      <TodoForm />
      <TodoList todos={todos} />
    </BaseHtml>
  );
});

//-----------------------------------------------------------------------------

// This adds a new todo.  It is the C in CRUD.
app.post(
  '/todos',
  ({body}: any) => {
    const {description} = body;
    if (description.length === 0) {
      throw new Error('Todo description cannot be empty');
    }
    const todo = addTodo(description);
    return (
      // <TodoItem todo={todo} />
      <TodoStatus />
    );
  },
  {
    body: t.Object({
      description: t.String()
    })
  }
);

//-----------------------------------------------------------------------------

// This toggles the completed state of a given todo.  It is the U in CRUD.
app.post(
  '/todos/toggle/:id',
  ({params}) => {
    console.log('index.tsx toggle: params =', params);
    const todo = todos.find(todo => todo.id === params.id);
    console.log('index.tsx toggle: todo =', todo);
    if (todo) {
      // todo.completed = !todo.completed;
      // return <TodoItem todo={todo} />;
      try {
        const result = updateTodoPS.run(todo.completed ? 0 : 1, todo.id);
        console.log('index.tsx post: result =', result);
      } catch (e) {
        console.error('index.tsx toggle: e =', e);
        throw e;
      }
    }
  },
  {
    params: t.Object({
      id: t.Numeric() // converts string param to a number
    })
  }
);

//-----------------------------------------------------------------------------

app.listen(1919);

console.log('listening on port', app.server?.port);
