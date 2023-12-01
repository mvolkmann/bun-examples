import haiku from './haiku.txt';
const lines = haiku.split('\n');
for (const line of lines) {
  const words = line.split(' ');
  console.log(`${words.length} words: ${line}`);
}
