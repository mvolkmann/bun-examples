# BETH Stack

## Overview

The BETH stack uses:

- Bun
- ElysiaJS
- typed-html
- HTMX

## Steps

- See the YouTube video at https://www.youtube.com/watch?v=cpzowDDJj24.
- create directory and cd to it
- enter "bun init"
- enter "bun add elysia"
- enter "bun add @elysiajs/html"
- enter "bun add @elysiajs/static"
- enter "bun add @kitajs/ts-html-plugin // detects XSS vulnerabilities
- enter "bun add -d typed-html" // TODO: Need this?
- modify "tsconfig.json" to contain the following lines

  ```json
    "jsx": "react",
    "jsxFactory": "Html.createElement",
    "jsxFragmentFactory": "Html.Fragment",
  ```

- modify "index.ts" to contain the following:

  ```ts
  import {Elysia} from 'elysia';

  const app = new Elysia();

  app.get('/', () => 'Hello, Elysia!');

  app.listen(1919);

  console.log('listening on port', app.server?.port);
  ```

- enter "bun run --watch index.ts"
- browse localhost:1919

- rename "index.ts" to "index.tsx"
- for VS Code users, install the "htmx-tags" extension

## Database Setup

- Create the database with `sqlite3 todos.db`
- Create a table with `create table todos(id integer primary key autoincrement, description string, completed numeric);`
- Verify that the table was created with `.schema`
- Insert two rows with `insert into todos values('t1', 'cut grass', 0);`
  and `insert into todos values('t2', 'buy milk', 1);`
- Verify that the rows were inserted with `select * from todos;`
- Exit with `.exit`
