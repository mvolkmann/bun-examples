const url = 'https://dog.ceo/api/breeds/list/all';
const stream = (await fetch(url)).body;
if (stream) {
  const object = await Bun.readableStreamToJSON(stream);
  console.log('readable-stream.ts: object =', object);
} else {
  console.error('readable-stream.ts: failed to get stream');
}
