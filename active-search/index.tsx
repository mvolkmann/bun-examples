import {Elysia} from 'elysia';
import {html} from '@elysiajs/html'; // enables use of JSX
import {staticPlugin} from '@elysiajs/static'; // enables static file serving

const app = new Elysia();
app.use(html());
app.use(staticPlugin());

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

// TODO: What type should be used for children?
const BaseHtml = ({children}: {children: any}) => (
  <html>
    <head>
      <title>HTMX Active Search</title>
      <link href="/public/tailwind.css" rel="stylesheet" />
      <script src="https://unpkg.com/htmx.org@1.9.9"></script>
    </head>
    <body class="p-8">{children}</body>
  </html>
);

app.get('/', () => {
  return (
    <BaseHtml>
      <main>
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
      </main>
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
