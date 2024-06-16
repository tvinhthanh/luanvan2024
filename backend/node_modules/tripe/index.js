"use strict"

const { assert } = require("@sindresorhus/is")
const translate = require("./lib/translate")

module.exports = (text, from, to) => {
	if (!to) {
		to = from
		from = "auto"
	}

	assert.string(text)
	assert.string(from)
	assert.string(to)

	return translate({ text, from, to })
}
