// @title Numbers in other bases
// @difficulty 3
// @tags numbers, radix
// @distractor 11001\nff\nNaN
// @distractor 25\n255\n0.5
// @distractor 11001\nFF\n0.5
// @explain toString(radix) converts to that base: 25 is 11001 in binary and 255 is ff in hex (lower case). Fractions work too — 0.5 is exactly one half, which is 0.1 in binary.
console.log((25).toString(2));
console.log((255).toString(16));
console.log((0.5).toString(2));
