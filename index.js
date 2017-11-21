'use strict'

const ms = require('ms')

module.exports = function (stream, what, timeout='4s') {
	const matcher = typeof what === 'function' ? what : ((x) => x.match(what) !== null)
	return new Promise((resolve, reject) => {
		let to
		const listener = () => {
			clearTimeout(to)
			const data = stream.read()
			if (matcher(data)) {
				resolve(data)
			} else {
				reject(new Error('Did not match: ' + data))
			}
		}
		to = setTimeout(() => {
			stream.removeListener('readable', listener)
			reject(new Error('Timed out'))
		}, ms(timeout))
		stream.once('readable', listener)
	})
}
