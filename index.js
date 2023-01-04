import baseX from '@vandeurenglenn/base-x';

const ALPHABET = '0123456789ABCDEF';
const base16 = baseX(ALPHABET);
const decode = base16.decode;
const encode = base16.encode;
const isBase16 = (string) => {
    try {
        decode(string);
        return true;
    }
    catch (e) {
        return false;
    }
};
var index = {
    encode,
    decode,
    isBase16
};

export { decode, index as default, encode, isBase16 };
