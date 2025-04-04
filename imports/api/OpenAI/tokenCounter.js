import { encode } from "gpt-3-encoder";

/**
 * Returns the token count for a given text string.
 * @param {string} text 
 * @returns {number}
 */
export function countTokens(text) {
    return encode(text).length;
}