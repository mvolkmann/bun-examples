import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX

const app = new Elysia();
app.use(html());

const names: string[] = [
  'Amanda',
  'Gerri',
  'Jeremy',
  'Mark',
  'Meghan',
  'Pat',
  'RC',
  'Richard',
  'Tami'
];

const BaseHtml = ({children}: any) => (
  <html>
    <head>
      <title>HTMX Active Search</title>
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <label class="font-bold mr-4" for="name">
        Name
      </label>
      <input
        autofocus="true"
        class="border border-gray-500 p-1 rounded-lg"
        hx-post="/search"
        hx-trigger="keyup changed delay:200ms"
        hx-target="#matches"
        name="name"
        size="10"
      />
      <ul id="matches" />
    </BaseHtml>
  );
});

type Body = {name: string};
app.post('/search', ({body}) => {
  const lowerName = (body as Body).name.toLowerCase();
  if (lowerName == '') return '';
  const matches = names.filter(n => n.toLowerCase().includes(lowerName));
  return (
    <ul>
      {matches.map(name => (
        <li>{name}</li>
      ))}
    </ul>
  );
});

app.listen(1919);
console.log('listening on port', app.server?.port);
