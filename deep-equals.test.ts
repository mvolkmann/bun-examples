import {expect, test} from 'bun:test';

test('arrays deep equal', () => {
  const a1 = [1, [2, 3]];
  const a2 = [1, [2, 3]];
  expect(Bun.deepEquals(a1, a2)).toBe(true);

  // Trailing undefined elements are ignored
  // unless using strict mode.
  const a3 = [1, [2, 3], undefined];
  expect(Bun.deepEquals(a1, a3)).toBe(true);
  const strict = true;
  expect(Bun.deepEquals(a1, a3, strict)).toBe(false);
});

test('objects deep equal', () => {
  const v1 = {a: 1, b: {c: 3, d: 4}};
  const v2 = {a: 1, b: {c: 3, d: 4}};
  expect(Bun.deepEquals(v1, v2)).toBe(true);

  // Extra properties with undefined values are ignored
  // unless using strict mode.
  const v3 = {a: 1, b: {c: 3, d: 4, e: undefined}, f: undefined};
  expect(Bun.deepEquals(v1, v3)).toBe(true);
  const strict = true;
  expect(Bun.deepEquals(v1, v3, strict)).toBe(false);
});
