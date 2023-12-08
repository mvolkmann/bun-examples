import {Glob} from 'bun';

const glob = new Glob('**/*.ts');
for await (const file of glob.scan('.')) {
  if (file.startsWith('node_modules/')) continue;
  if (file.includes('/node_modules/')) continue;
  console.log(file);
}
