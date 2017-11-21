[![npm version](https://img.shields.io/npm/v/stream-protocol-expect.svg?style=flat)](https://www.npmjs.org/package/stream-protocol-expect)
[![npm downloads](https://img.shields.io/npm/dm/stream-protocol-expect.svg?style=flat)](https://www.npmjs.org/package/stream-protocol-expect)
[![Build Status](https://img.shields.io/travis/myfreeweb/stream-protocol-expect.svg?style=flat)](https://travis-ci.org/myfreeweb/stream-protocol-expect)
[![Unlicense](https://img.shields.io/badge/un-license-green.svg?style=flat)](http://unlicense.org)

# stream-protocol-expect

A tiny function for expecting matching data from a readable stream, e.g. for request-response protocols like SMTP and IMAP.

## Usage

First argument: the stream.

Second argument: matcher function or a regexp.
Make sure the stream is textual (an encoding is set), otherwise it will try to call your function or regexp `.match` on a `Buffer`!
(Your function can handle Buffers if you want, but there's no `match` on them :D)

Third argument (optional, default = `4s`): timeout ([zeit/ms](https://github.com/zeit/ms)).

Returns: a Promise that will be resolved with the matching data or rejected with an error.

For example, IMAP authentication:

```javascript
(async function () {
	const streamExpect = require('stream-protocol-expect')
	const tls = require('tls')
	const sock = tls.connect(993, 'mail.example.com')
	sock.setEncoding('utf-8')
	sock.setNoDelay(true)
	console.log('Got response: ', await streamExpect(sock, x => x.includes('OK')))
	sock.write('a login user@example.com hunter2\r\n')
	console.log('Got response: ', await streamExpect(sock, /^a\s*OK/, '1s'))
  // exception if not OK
	sock.end()
})()
```

Possibly something like [byline](https://github.com/jahewson/node-byline) might be helpful to ensure that it will actually match line-by-line.

## Installation

Install with [npm]:

```bash
npm i stream-protocol-expect
```

[npm]: https://www.npmjs.com

## Contributing

Please feel free to submit pull requests!

By participating in this project you agree to follow the [Contributor Code of Conduct](http://contributor-covenant.org/version/1/4/) and to release your contributions under the Unlicense.

[The list of contributors is available on GitHub](https://github.com/myfreeweb/stream-protocol-expect/graphs/contributors).

## License

This is free and unencumbered software released into the public domain.  
For more information, please refer to the `UNLICENSE` file or [unlicense.org](http://unlicense.org).
