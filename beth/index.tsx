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
  <body>
    ${children}
  </body>
</html>
`;

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

app.post('/clicked', () => <div>This is from the server.</div>);

app.listen(1919);

console.log('listening on port', app.server?.port);
