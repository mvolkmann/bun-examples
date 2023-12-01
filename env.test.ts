import {expect, test} from 'bun:test';

test('environment variables', async () => {
  expect(process.env.NAME).toBe('Mark');
  expect(Bun.env.GREETING).toBe('Hello, Mark!');
});
