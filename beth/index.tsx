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

const todos: Todo[] = [
  {id: 1, description: 'Buy milk', completed: true},
  {id: 2, description: 'Cut grass', completed: false}
];

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
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

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
      <p>{description}</p>
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
    <TodoList todos={todos} />
  </BaseHtml>
));

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
