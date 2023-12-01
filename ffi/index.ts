// To run this, enter "bun run index.ts".
import {dlopen, FFIType, ptr, suffix} from 'bun:ffi';

// Open a dynamic library.
const path = `libaverage.${suffix}`;
const lib = dlopen(path, {
  average: {
    args: [FFIType.ptr, FFIType.i32],
    returns: FFIType.f32
  }
});

// Get a reference to the average function.
const average = lib.symbols.average;

// Create and pass a typed array.
const numbers = new Float32Array([1, 2, 3, 4]);
const result = average(ptr(numbers), numbers.length);
console.log('average is', result);
