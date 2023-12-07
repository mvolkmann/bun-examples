const thisURL = import.meta.url;
const prefix = 'file://';
// openInEditor only works if the prefix is removed.
const path = thisURL.substring(prefix.length);
// const path = '/Users/volkmannm/Documents/dev/bun/bun-examples/.prettierrc';
console.log('open-in-editor.ts: path =', path);

Bun.openInEditor(path, {editor: 'vscode'});
Bun.sleepSync(10); // TODO: Why is this needed?  0 & 1 don't work.
