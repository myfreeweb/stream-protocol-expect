const test = require('tape')
const Readable = require('stream').Readable
const streamExpect = require('./')

test('await-after', async t => {
	t.plan(1)
	const stream = new Readable({ encoding: 'utf-8' })
	stream.push('test')
	stream.push(null)
	t.equal(await streamExpect(stream, /t/), 'test')
})

test('then-before', t => {
	t.plan(1)
	const stream = new Readable({ encoding: 'utf-8' })
	streamExpect(stream, x => x.includes('tes')).then(x => t.equal(x, 'test'))
	stream.push('test')
	stream.push(null)
})

test('wrong', t => {
	t.plan(1)
	const stream = new Readable({ encoding: 'utf-8' })
	streamExpect(stream, x => !x.includes('tes'))
		.catch(e => t.equal(e.toString(), 'Error: Did not match: test'))
	stream.push('test')
	stream.push(null)
})

test('timeout', async t => {
	t.plan(1)
	const stream = new Readable({ encoding: 'utf-8' })
	stream.push(null)
	await streamExpect(stream, _ => true)
	try {
		await streamExpect(stream, _ => true, '0.1 s')
	} catch (e) {
		t.equal(e.toString(), 'Error: Timed out')
	}
})
