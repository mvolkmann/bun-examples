import {Elysia} from 'elysia';
import {html} from '@elysiajs/html';
import * as elements from 'typed-html';

const BaseHtml = ({children}: elements.Children) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BETH stack demo</title>
    <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="p-8">
    ${children}
  </body>
</html>
`;

type Todo = {
  id: number;
  description: string;
  completed: boolean;
};

const todos: Todo[] = [
  {id: 1, description: 'Buy milk', completed: true},
  {id: 2, description: 'Cut grass', completed: false}
];

type TodoItemProps = {todo: Todo};
function TodoItem({todo}: TodoItemProps) {
  return (
    <div class="flex gap-4">
      <input type="checkbox" checked={todo.completed} />
      <p>{todo.description}</p>
      <button class="text-red-500">X</button>
    </div>
  );
}

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

const app = new Elysia();
app.use(html());

// app.get('/', () => 'Hello, Elysia!');

app.get('/', ({html}) =>
  html(
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
  )
);

app.get('/todos', () => (
  <BaseHtml>
    <TodoList todos={todos} />
  </BaseHtml>
));

app.post('/clicked', () => <div>This is from the server.</div>);

app.listen(1919);

console.log('listening on port', app.server?.port);
