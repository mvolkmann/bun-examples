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

test('circular references', () => {
  type Node = {
    value: number;
    next: Node | null;
  };
  const node1: Node = {
    value: 1,
    next: null
  };
  const node2: Node = {
    value: 2,
    next: node1
  };
  node1.next = node2;

  const buffer = serialize(node1);
  const newNode = deserialize(buffer);
  expect(newNode).toStrictEqual(node1);
  expect(newNode.value).toBe(1);
  expect(newNode.next.value).toBe(2);
  expect(newNode.next.next.value).toBe(1);
});
