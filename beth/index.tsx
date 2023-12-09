import {Elysia, t} from 'elysia';
import {html} from '@elysiajs/html';
import * as elements from 'typed-html';
import {Attributes} from 'typed-html';

const app = new Elysia();
app.use(html());

type Todo = {
  id: number;
  description: string;
  completed: boolean;
};

let nextId = 0;
const todos: Todo[] = [];

function addTodo(description: string) {
  const todo = {id: nextId++, description, completed: false};
  todos.push(todo);
  return todo;
}

addTodo('buy milk');
addTodo('cut grass');

//-----------------------------------------------------------------------------

// <!DOCTYPE html>
// const BaseHtml = ({children}: elements.Children) => (
const BaseHtml = ({children}: Attributes) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>BETH stack demo</title>
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
      <script src="https://cdn.tailwindcss.com"></script>
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
      _="on submit target.reset()"
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
        checked={completed}
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

app.delete(
  '/todos/:id',
  ({params}) => {
    const todo = todos.find(todo => todo.id === params.id);
    if (todo) {
      todos.splice(todos.indexOf(todo), 1);
    }
    // By not returning any HTML, we replace the existing todo item with nothing.
  },
  {
    params: t.Object({
      id: t.Numeric()
    })
  }
);

//-----------------------------------------------------------------------------

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

app.get('/todos', () => (
  <BaseHtml>
    <h2>To Do List</h2>
    <TodoForm />
    <TodoList todos={todos} />
  </BaseHtml>
));

//-----------------------------------------------------------------------------

app.post(
  '/todos',
  ({body}) => {
    const {description} = body;
    if (description.length === 0) {
      throw new Error('Todo description cannot be empty');
    }
    const todo = addTodo(description);
    return <TodoItem todo={todo} />;
  },
  {
    body: t.Object({
      description: t.String()
    })
  }
);

//-----------------------------------------------------------------------------

app.post(
  '/todos/toggle/:id',
  ({params}) => {
    const todo = todos.find(todo => todo.id === params.id);
    if (todo) {
      todo.completed = !todo.completed;
      return <TodoItem todo={todo} />;
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
