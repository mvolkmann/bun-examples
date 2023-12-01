const prompt = () => console.write('Enter text: ');

prompt();
for await (const line of console) {
  const trimmed = line.trim();
  if (trimmed.length === 0) {
    process.exit(0); // break does not work
  }
  const words = trimmed.split(' ');
  console.log(`words: ${words.length}, characters: ${line.length}`);
  prompt();
}
