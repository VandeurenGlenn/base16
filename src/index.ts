import baseX from '@vandeurenglenn/base-x'

/**
 * A base16String only contains [0-9][A-F]
 */
type base16String = string

const ALPHABET = '0123456789ABCDEF'

const base16 = baseX(ALPHABET)

export const decode = base16.decode

export const encode = base16.encode

export const isBase16 = (string: base16String): boolean => {
  try {
    decode(string)
    return true;
  } catch (e) {
    return false;
  }
}

export default {
  encode,
  decode,
  isBase16
}
