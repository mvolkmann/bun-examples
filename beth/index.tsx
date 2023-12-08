import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';

const baseHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charaset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BETH stack demo</title>
  </head>
  <body>
    This is in the body.
  </body>
</html>
`;

const app = new Elysia();
app.use(html());

// app.get('/', () => 'Hello, Elysia!');
app.get('/', ({ html }) => html(baseHtml));

app.listen(1919);

console.log('listening on port', app.server?.port);
