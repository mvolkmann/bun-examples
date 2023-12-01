import {expect, test} from 'bun:test';

test('import.meta', async () => {
  // import.meta.env is just an alias for process.env.
  expect(import.meta.env).toBe(process.env);

  // These get the directory and file name of the current file.
  const dir = import.meta.dir;
  const file = import.meta.file;
  expect(dir).toBe('/Users/volkmannm/Documents/dev/bun/bun-examples');
  expect(file).toBe('import-meta.test.ts');
  expect(import.meta.path).toBe(`${dir}/${file}`);

  // This indicates whether the current file is the one
  // that was directly executed by "bun run" or "bun test".
  expect(import.meta.main).toBe(true);

  // This finds the path of a file relative to the current file.
  const importName = 'dogs.json';
  const resolved = await import.meta.resolve('./' + importName);
  expect(resolved).toBe(`${dir}/${importName}`);
});
