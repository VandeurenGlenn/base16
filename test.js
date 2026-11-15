import base16 from "./index.js";
import test from "node:test";
import assert from "node:assert";
import { log } from "node:console";

const uint8Array = new TextEncoder().encode("hi");

test("base16", () => {
  const base16Encoded = base16.encode(uint8Array);
  assert.strictEqual(base16Encoded.length, 4, "can encode");

  assert.ok(base16.isBase16(base16Encoded), "is base16String");

  const base16Decoded = base16.decode(base16Encoded);

  const string = new TextDecoder().decode(base16Decoded);

  assert.strictEqual(string, "hi", "can decode");
});

test("RFC 4648 test vectors", () => {
  const vectors = [
    ["", ""],
    ["f", "66"],
    ["fo", "666F"],
    ["foo", "666F6F"],
    ["foob", "666F6F62"],
    ["fooba", "666F6F6261"],
    ["foobar", "666F6F626172"],
  ];

  for (const [input, expected] of vectors) {
    const encoded = base16.encode(new TextEncoder().encode(input));
    assert.strictEqual(encoded, expected, `encodes ${input}`);

    // Test helper to decode string from base16
    const decoded = new TextDecoder().decode(base16.decode(expected));
    assert.strictEqual(decoded, input, `decodes ${expected}`);
  }
});

test("isBase16 validation", () => {
  assert.ok(base16.isBase16("0123456789ABCDEF"), "valid alphabet");
  assert.strictEqual(base16.isBase16("G"), false, "invalid character G");
  assert.strictEqual(base16.isBase16("NotHex"), false, "invalid string NotHex");
  assert.strictEqual(base16.isBase16("Ā0"), false, "invalid non-ASCII character");
  assert.strictEqual(base16.isBase16("AAA\n"), false, "invalid line break");
});

test("encoding and decoding respect Uint8Array views", () => {
  const data = new Uint8Array([0xff, 0x00, 0x42, 0x10]);
  const view = data.subarray(1, 3);

  assert.strictEqual(base16.encode(view), "0042");
  assert.deepStrictEqual(base16.decode("0042"), new Uint8Array([0x00, 0x42]));
});

test("Cross-check with Node.js Buffer", () => {
  for (let i = 0; i < 1000; i++) {
    const length = Math.floor(Math.random() * 100);
    const data = new Uint8Array(length);
    for (let j = 0; j < length; j++) data[j] = Math.floor(Math.random() * 256);

    // Node.js Buffer (Gold Standard)
    const expectedHex = Buffer.from(data).toString("hex").toUpperCase();

    // Our implementation
    const actualHex = base16.encode(data);

    assert.strictEqual(
      actualHex,
      expectedHex,
      `Encoding mismatch at iter ${i}`,
    );

    const decoded = base16.decode(actualHex);
    const expectedBuffer = Buffer.from(data);
    const actualBuffer = Buffer.from(decoded);

    assert.deepStrictEqual(
      actualBuffer,
      expectedBuffer,
      `Decoding mismatch at iter ${i}`,
    );
  }
});
