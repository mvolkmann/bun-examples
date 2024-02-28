import {serialize, deserialize} from 'bun:jsc';
import {expect, test} from 'bun:test';

test('serialize', () => {
  const dogs = [
    {name: 'Comet', breed: 'Whippet'},
    {name: 'Oscar', breed: 'German Shorthaired Pointer'}
  ];
  const buffer = serialize(dogs); // a SharedArrayBuffer
  console.log('serialize.test.ts:', buffer.constructor.name);
  const newDogs = deserialize(buffer);
  expect(newDogs).toStrictEqual(dogs);
});
