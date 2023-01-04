import base16 from './index.js'
import test from 'tape'

const uint8Array = new TextEncoder().encode('hi')

test('base16', tape => {
  tape.plan(3)

  const base16Encoded = base16.encode(uint8Array)
  tape.ok(base16Encoded.length === 4, 'can encode')
  
  tape.ok(base16.isBase16(base16Encoded), 'is base16String')

  const base16Decoded = base16.decode(base16Encoded)
  
  const string = new TextDecoder().decode(base16Decoded)

  tape.ok(string === 'hi', 'can decode')
})
