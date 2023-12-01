// To build this as a library, enter
// zig build-lib average.zig -dynamic -OReleaseFast
pub export fn average(numbers_ptr: [*]const f32, len: usize) f32 {
    var sum: f32 = 0.0;
    const numbers = numbers_ptr[0..len];
    for (numbers) |number| {
        sum += number;
    }
    const float_len: f32 = @floatFromInt(len);
    return sum / float_len;
}
