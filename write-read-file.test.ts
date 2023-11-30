import {expect, test} from 'bun:test';

test('write/read file', async () => {
  const filePath = './data.txt';
  const content = 'Hello, World!';
  await Bun.write(filePath, content);

  const file = Bun.file(filePath);
  const actual = await file.text(); // also see .json() method
  expect(actual).toBe(content);
});
