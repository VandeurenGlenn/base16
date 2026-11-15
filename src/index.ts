const ALPHABET = "0123456789ABCDEF";
const INVALID_BASE16 = /[^0-9a-f]/i;
const BYTE_TO_HEX = Array.from(
  { length: 256 },
  (_, byte) => ALPHABET[byte >> 4] + ALPHABET[byte & 0xf],
);
const PAIR_LOOKUP_THRESHOLD = 512 * 1024;
const PAIR_LOOKUP_MIN_LENGTH = 1024;
const LOOKUP = new Uint8Array(256).fill(255);
let BYTE_PAIR_TO_HEX: string[] | undefined;
for (let i = 0; i < 16; i++) {
  const code = ALPHABET.charCodeAt(i);
  LOOKUP[code] = i;
  // Initialize lowercase if it's a letter (A=65, a=97, diff=32)
  if (i > 9) LOOKUP[code + 32] = i;
}

const encodePairsJS = (
  buffer: Uint8Array,
  lookup: string[],
): string => {
  let str = "";
  for (let start = 0; start < buffer.length; start += 8192) {
    let chunk = "";
    const end = Math.min(start + 8192, buffer.length);
    let i = start;
    for (; i + 1 < end; i += 2) {
      chunk += lookup[(buffer[i] << 8) | buffer[i + 1]];
    }
    if (i < end) chunk += BYTE_TO_HEX[buffer[i]];
    str += chunk;
  }
  return str;
};

const encodeJS = (buffer: Uint8Array): string => {
  if (!BYTE_PAIR_TO_HEX && buffer.length >= PAIR_LOOKUP_THRESHOLD) {
    BYTE_PAIR_TO_HEX = Array.from(
      { length: 65536 },
      (_, pair) => BYTE_TO_HEX[pair >> 8] + BYTE_TO_HEX[pair & 0xff],
    );
  }
  if (BYTE_PAIR_TO_HEX && buffer.length >= PAIR_LOOKUP_MIN_LENGTH) {
    return encodePairsJS(buffer, BYTE_PAIR_TO_HEX);
  }

  let str = "";
  for (let start = 0; start < buffer.length; start += 4096) {
    let chunk = "";
    const end = Math.min(start + 4096, buffer.length);
    for (let i = start; i < end; i++) {
      chunk += BYTE_TO_HEX[buffer[i]];
    }
    str += chunk;
  }
  return str;
};

const decodeJS = (string: string): Uint8Array => {
  if (string.length % 2 !== 0) throw new Error("Invalid base16 string length");
  const buffer = new Uint8Array(string.length / 2);
  for (let i = 0, output = 0; i < string.length; i += 2, output++) {
    const a = LOOKUP[string.charCodeAt(i)];
    const b = LOOKUP[string.charCodeAt(i + 1)];
    if (a === undefined || b === undefined || a === 255 || b === 255)
      throw new Error("Invalid base16 character");
    buffer[output] = (a << 4) | b;
  }
  return buffer;
};

const isBase16JS = (string: string): boolean => {
  if (typeof string !== "string") return false;
  return string.length % 2 === 0 && !INVALID_BASE16.test(string);
};

const hasBuffer = typeof Buffer !== "undefined";

export const encode = hasBuffer
  ? (buffer: Uint8Array): string =>
      Buffer.from(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      ).toString("hex").toUpperCase()
  : encodeJS;

export const decode = hasBuffer
  ? (string: string): Uint8Array => {
      const buffer = Buffer.from(string, "hex");
      if (buffer.length !== string.length / 2) {
        if (string.length % 2 !== 0)
          throw new Error("Invalid base16 string length");
        throw new Error("Invalid base16 character");
      }
      return new Uint8Array(
        buffer.buffer,
        buffer.byteOffset,
        buffer.byteLength,
      );
    }
  : decodeJS;

export const isBase16 = isBase16JS;

const index = {
  encode,
  decode,
  isBase16,
};

export default index;
