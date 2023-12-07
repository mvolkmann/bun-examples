const thisURL = import.meta.url;
const path = Bun.fileURLToPath(new URL(thisURL));
console.log('open-in-editor.ts: path =', path);

Bun.openInEditor(path, {editor: 'vscode'});
Bun.sleepSync(10); // TODO: Why is this needed?  0 & 1 don't work.
