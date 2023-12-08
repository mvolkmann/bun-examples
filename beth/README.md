# BETH Steps

- See the YouTube video at https://www.youtube.com/watch?v=cpzowDDJj24.
- create directory and cd to it
- enter "bun init"
- enter "bun add elysia"
- enter "bun add @elysiajs/html"
- enter "bun add -d typed-html"
- add the following line in "tsconfig.json"

  ```json
    "jsxFactory": "elements.createElement",
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
