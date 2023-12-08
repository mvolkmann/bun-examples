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
      <h1>Hello, typed-html!</h1>
    </BaseHtml>
  )
);

app.listen(1919);

console.log('listening on port', app.server?.port);
