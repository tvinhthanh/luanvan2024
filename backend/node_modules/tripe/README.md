# Tripe [![Travis CI Build Status](https://img.shields.io/travis/com/Richienb/tripe/master.svg?style=for-the-badge)](https://travis-ci.com/Richienb/tripe)

Translate text through Google Translate.

[![NPM Badge](https://nodei.co/npm/tripe.png)](https://npmjs.com/package/tripe)

## Improvements over `google-translate-api`

- Supports browsers.
- Automatically autocorrect text.
- Simpler interface.
- Actively maintained.

## Install

```sh
npm install tripe
```

## Usage

```js
const tripe = require("tripe");

(async () => {
	await tripe("Good morning", "fr")
	//=> 'Bonjour!'
})()
```

## API

### tripe(text, from, to)
### tripe(text, to)

#### text

Type: `string`

The text to translate.

##### from

Type: `string`

The initial language.

##### to

Type: `string`

The target language.
