/**
 * Check if a number is a prime number.
 * @param text The text to translate.
 * @param from The initial language.
 * @param to The target language.
 * @example
 * ```
 * const tripe = require("tripe");
 *
 * (async () => {
 * 	await tripe("Hello!", "fr")
 * 	//=> Bonjour
 * })()
 * ```
*/
declare function tripe(text: string, to: string): Promise<string>
declare function tripe(text: string, from: string, to: string): Promise<string>

export = tripe
