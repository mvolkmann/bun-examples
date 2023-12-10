import {Database} from 'bun:sqlite';
import {Elysia, t} from 'elysia';
import {html} from '@elysiajs/html';
import {staticPlugin} from '@elysiajs/static';
// import * as elements from 'typed-html';
import {Attributes} from 'typed-html';

const app = new Elysia();
app.use(html());
app.use(staticPlugin());

const db = new Database('todos.db', {create: true});
const deleteTodoPS = db.prepare('delete from todos where id = ?');
const getAllTodosQuery = db.query('select * from todos;');
const getTodoQuery = db.query('select * from todos where id = ?');
const insertTodoQuery = db.query(
  'insert into todos (description, completed) values (?, 0) returning id'
);
const updateTodoPS = db.prepare('update todos set completed=? where id = ?');

type Todo = {
  id: number;
  description: string;
  completed: number; // 0 or 1 for SQLite compatibility
};

// This is the state.
let nextId = 0;
const todos: Todo[] = [];

function addTodo(description: string) {
  try {
    const {id} = insertTodoQuery.get(description) as {id: number};
    return {id, description, completed: 0};
  } catch (e) {
    console.error('index.tsx post: e =', e);
    const isDuplicate = e.toString().includes('UNIQUE constraint failed');
    throw isDuplicate ? new Error('duplicate todo ' + description) : e;
  }
}

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
    try {
      deleteTodoPS.run(params.id);
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
      <button hx-post="/clicked" hx-swap="outerHTML">
        Click Me
      </button>
    </div>
  </BaseHtml>
));

//-----------------------------------------------------------------------------

// This renders the todo list UI.  It is the R in CRUD.
app.get('/todos', () => {
  const todos = getAllTodosQuery.all();

  return (
    <BaseHtml>
      <h1>To Do List</h1>
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
      <TodoItem todo={todo} />
      // <TodoStatus />
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
    const todo = getTodoQuery.get(params.id) as Todo;
    if (todo) {
      try {
        todo.completed = 1 - todo.completed;
        updateTodoPS.run(todo.completed, todo.id);
      } catch (e) {
        console.error('index.tsx toggle: e =', e);
        throw e;
      }
    }
    return <TodoItem todo={todo} />;
  },
  {
    params: t.Object({
      id: t.Numeric() // converts string param to a number
    })
  }
);

//-----------------------------------------------------------------------------

const callback: ListenCallback = async ({hostname, port}) => {
  console.log('index.tsx callback: hostname =', hostname);
  console.log('index.tsx callback: port =', port);
  /*
  if (!globalThis.isOpened) {
    globalThis.isOpened = true;
    open(`http://${hostname}:${port}`); // https://www.npmjs.com/package/open
  }

  if (globalThis.ws) globalThis.ws.send('live-reload');
  */
};

app.listen(1919, callback);

console.log('listening on port', app.server?.port);
