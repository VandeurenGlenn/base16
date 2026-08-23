const ALPHABET = "0123456789ABCDEF";
const LOOKUP = new Uint8Array(256).fill(255);
for (let i = 0; i < 16; i++) {
  const code = ALPHABET.charCodeAt(i);
  LOOKUP[code] = i;
  // Initialize lowercase if it's a letter (A=65, a=97, diff=32)
  if (i > 9) LOOKUP[code + 32] = i;
}

const encodeJS = (buffer: Uint8Array): string => {
  let str = "";
  for (let i = 0; i < buffer.length; i++) {
    str += ALPHABET[buffer[i] >> 4] + ALPHABET[buffer[i] & 0xf];
  }
  return str;
};

const decodeJS = (string: string): Uint8Array => {
  if (string.length % 2 !== 0) throw new Error("Invalid base16 string length");
  const buffer = new Uint8Array(string.length / 2);
  for (let i = 0; i < string.length; i += 2) {
    const a = LOOKUP[string.charCodeAt(i)];
    const b = LOOKUP[string.charCodeAt(i + 1)];
    if (a === 255 || b === 255) throw new Error("Invalid base16 character");
    buffer[i / 2] = (a << 4) | b;
  }
  return buffer;
};

const isBase16JS = (string: string): boolean => {
  if (typeof string !== "string") return false;
  if (string.length % 2 !== 0) return false;
  for (let i = 0; i < string.length; i++) {
    if (LOOKUP[string.charCodeAt(i)] === 255) return false;
  }
  return true;
};

const hasBuffer = typeof Buffer !== "undefined";

export const encode = hasBuffer
  ? (buffer: Uint8Array): string =>
      Buffer.from(buffer).toString("hex").toUpperCase()
  : encodeJS;

export const decode = hasBuffer
  ? (string: string): Uint8Array => {
      const buffer = Buffer.from(string, "hex");
      if (buffer.length !== string.length / 2) {
        if (string.length % 2 !== 0)
          throw new Error("Invalid base16 string length");
        throw new Error("Invalid base16 character");
      }
      return new Uint8Array(buffer);
    }
  : decodeJS;

export const isBase16 = hasBuffer
  ? (string: string): boolean => {
      if (typeof string !== "string") return false;
      if (string.length % 2 !== 0) return false;
      const buffer = Buffer.from(string, "hex");
      return buffer.length === string.length / 2;
    }
  : isBase16JS;

const index = {
  encode,
  decode,
  isBase16,
};

export default index;
