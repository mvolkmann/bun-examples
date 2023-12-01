import dogs from './dogs.json';
for (const dog of dogs) {
  console.log(`${dog.name} is a ${dog.breed}.`);
}
