# bs32

module compatible base16

## Usage

``` js
import base16 from '@vandeurenglenn/base16'

const uint8Array = new TextEncoder().encode('hi')

const base16Encoded = base16.encode(uint8Array)

console.log(base16Encoded) // 2dj

const base16Decoded = base16.decode(base16Encoded)

const string = new TextDecoder().decode(base16Decoded)

console.log(string) // hi
```
