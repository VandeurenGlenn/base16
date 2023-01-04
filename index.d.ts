/**
 * A base16String only contains [0-9][A-F]
 */
type base16String = string;
export declare const decode: (source: string) => Uint8Array;
export declare const encode: (source: Uint8Array | ArrayBuffer) => string;
export declare const isBase16: (string: base16String) => boolean;
declare const _default: {
    encode: (source: Uint8Array | ArrayBuffer) => string;
    decode: (source: string) => Uint8Array;
    isBase16: (string: string) => boolean;
};
export default _default;
