// bar.ts
function bar() {
  console.log("in bar.ts");
}

// foo.ts
function foo() {
  console.log("in foo.ts");
  bar();
}

// index.ts
console.log("in index.ts");
foo();
