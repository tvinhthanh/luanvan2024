"use strict"

const ky = require("ky-universal")
const queryString = require("query-string")

const getToken = require("./token")

const url = typeof window === "undefined" ? "https://translate.google.com/translate_a/single" : "https://cors-anywhere.herokuapp.com/https://translate.google.com/translate_a/single"

module.exports = async (options) => {
	const data = {
		client: "gtx",
		sl: options.from,
		tl: options.to,
		hl: options.to,
		dt: ["at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t"],
		ie: "UTF-8",
		oe: "UTF-8",
		otf: 1,
		ssel: 0,
		tsel: 0,
		kc: 7,
		q: options.text,
		tk: getToken(options.text),
	}

	const [translated] = await ky(url, {
		searchParams: queryString.stringify(data, { arrayFormat: "none" }),
	}).json()

	if (translated[0][4] === 0) throw new ReferenceError("Language not supported!")

	return translated.map(([result]) => result).join("")
}


