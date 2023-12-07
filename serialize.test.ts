import {serialize, deserialize} from 'bun:jsc';
import {expect, test} from 'bun:test';

test('serialize', async () => {
  const dogs = [
    {name: 'Comet', breed: 'Whippet'},
    {name: 'Oscar', breed: 'German Shorthaired Pointer'}
  ];
  const buffer = serialize(dogs);
  const newDogs = deserialize(buffer);
  expect(Bun.deepEquals(dogs, newDogs)).toBe(true);
});
