/**
 * Returns true if the character is considered a sentence terminator.
 * This includes ASCII (".", "!", "?") and common Unicode terminators.
 * NOTE: We also include newlines here, as this is favourable for text-to-speech systems.
 * @param {string} c
 * @returns {boolean}
 */
function isSentenceTerminator(c) {
  return ".!?…。？！\n".includes(c);
}

/**
 * Returns true if the character should be attached to the terminator,
 * for example closing quotes or brackets.
 * @param {string} c
 * @returns {boolean}
 */
function isTrailingChar(c) {
  return "\"')]}」』".includes(c);
}

/**
 * Starting at index 'start', extracts a token (a contiguous run of non–whitespace)
 * from the buffer.
 * @param {string} buffer
 * @param {number} start
 * @returns {string}
 */
function getTokenFromBuffer(buffer, start) {
  let end = start;
  while (end < buffer.length && !/\s/.test(buffer[end])) {
    end++;
  }
  return buffer.substring(start, end);
}

// NOTE: strings with single letters joined by periods (like "i.e", "e.g", "u.s.a", "u.s") are handled in a separate case
const ABBREVIATIONS = new Set([
  "mr",
  "mrs",
  "ms",
  "dr",
  "prof",
  "sr",
  "jr",
  "sgt",
  "col",
  "gen",
  "rep",
  "sen",
  "gov",
  "lt",
  "maj",
  "capt",
  "st",
  "mt",
  "etc",
  "co",
  "inc",
  "ltd",
  "dept",
  "vs",
  "p",
  "pg",
  "jan",
  "feb",
  "mar",
  "apr",
  "jun",
  "jul",
  "aug",
  "sep",
  "sept",
  "oct",
  "nov",
  "dec", // Months
  "sun",
  "mon",
  "tu",
  "tue",
  "tues",
  "wed",
  "th",
  "thu",
  "thur",
  "thurs",
  "fri",
  "sat", // Days of the week
]);

/**
 * Returns true if the token (or series of initials) is known to be an abbreviation.
 * @param {string} token
 * @returns {boolean}
 */
function isAbbreviation(token) {
  token = token.replace(/['’]s$/i, "");
  token = token.replace(/\.+$/, "");
  return ABBREVIATIONS.has(token.toLowerCase());
}

const MATCHING = new Map([
  [")", "("],
  ["]", "["],
  ["}", "{"],
  ["》", "《"],
  ["〉", "〈"],
  ["›", "‹"],
  ["»", "«"],
  ["〉", "〈"],
  ["」", "「"],
  ["』", "『"],
]);
const OPENING = new Set(MATCHING.values());
/**
 * Updates the nesting stack to track quotes and paired punctuation.
 * This function supports both standard (", ', (), [], {}) and Japanese quotes (「」「』『』).
 * (An apostrophe between letters is ignored so that contractions remain intact.)
 * @param {string} c The current character.
 * @param {string[]} stack The current stack.
 * @param {number} i The index of c in buffer.
 * @param {string} buffer The full text being processed.
 */
function updateStack(c, stack, i, buffer) {
  // Standard quotes.
  if (c === '"' || c === "'") {
    // Ignore an apostrophe if it’s between letters (as in contractions).
    if (c === "'" && i > 0 && i < buffer.length - 1 && /[A-Za-z]/.test(buffer[i - 1]) && /[A-Za-z]/.test(buffer[i + 1])) {
      return;
    }
    if (stack.length && stack[stack.length - 1] === c) {
      stack.pop();
    } else {
      stack.push(c);
    }
    return;
  }
  // Opening punctuation.
  if (OPENING.has(c)) {
    stack.push(c);
    return;
  }
  // Closing punctuation.
  const closing = MATCHING.get(c);
  if (closing) {
    if (stack.length && stack[stack.length - 1] === closing) {
      stack.pop();
    }
    return;
  }
}

/**
 * A simple stream-based text splitter that emits complete sentences.
 */
export class TextSplitterStream {
  /**
   * @param {function(string):any} callback
   * @param {object} options
   */
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = options;
    this.buffer = "";
  }

  /**
   * Push one or more strings into the stream.
   * @param  {...string} texts
   */
  push(...texts) {
    for (const txt of texts) {
      this.buffer += txt;
      this._process();
    }
  }

  /**
   * Closes the stream and flushes any remaining text.
   */
  close() {
    // On close, flush whatever remains.
    const remainder = this.buffer.trim();
    if (remainder.length > 0) {
      this.callback(remainder);
    }
    this.buffer = "";
  }

  /**
   * Processes the internal buffer and emits complete sentences.
   * If the potential sentence boundary is at the end of the current buffer (i.e.,
   * we have no non–whitespace lookahead), we do not flush it yet.
   */
  _process() {
    let flushIndex = 0;
    let stack = [];
    let sentences = [];
    let i = 0;
    const len = this.buffer.length;

    while (i < len) {
      const c = this.buffer[i];

      updateStack(c, stack, i, this.buffer);

      // Only consider splitting if we're not inside any nested structure.
      if (stack.length === 0 && isSentenceTerminator(c)) {
        // Most likely a numbered list, so skip splitting.
        const current = this.buffer.slice(flushIndex, i);
        if (/(^|\n)\d+$/.test(current)) {
          ++i;
          continue;
        }

        // Consume any contiguous terminators and trailing characters.
        let j = i;
        while (j + 1 < len && isSentenceTerminator(this.buffer[j + 1])) {
          ++j;
        }
        while (j + 1 < len && isTrailingChar(this.buffer[j + 1])) {
          ++j;
        }
        // Look ahead for the next non–whitespace character.
        let n = j + 1;
        while (n < len && /\s/.test(this.buffer[n])) {
          ++n;
        }

        // No space after the terminator, so we can't be sure it's a boundary.
        // This ensures things like currency (e.g., $9.99) isn't split
        if (i === n - 1) {
          ++i;
          continue;
        }

        // If there is no non–whitespace character yet, wait for more text.
        if (n === len) {
          break;
        }

        // Determine the token immediately preceding the terminator.
        let tokenStart = i - 1;
        while (tokenStart >= 0 && /\S/.test(this.buffer[tokenStart])) {
          --tokenStart;
        }
        tokenStart = Math.max(flushIndex, tokenStart + 1);
        const token = getTokenFromBuffer(this.buffer, tokenStart);

        // --- URL/email protection ---
        // If the token appears to be a URL or email (contains "://" or "@")
        // and the token does not end with a sentence terminator,
        // assume we are in the middle of the token and skip splitting.
        if (/https?[,:]\/\//.test(token) || token.includes("@")) {
          // Only skip splitting if the token does not already end with a terminator.
          if (!isSentenceTerminator(token.at(-1))) {
            i = tokenStart + token.length;
            continue;
          }
        }

        // --- Abbreviation protection ---
        if (isAbbreviation(token)) {
          ++i;
          continue;
        }

        // Apply a heuristic to detect middle initials.
        // If a series of single-letter initials (each ending in a period) is followed by a capitalized word,
        // then it is likely a name and should not be split
        if (/^([A-Za-z]\.)+$/.test(token) && n < len && /[A-Z]/.test(this.buffer[n])) {
          ++i;
          continue;
        }

        // --- Lookahead: if current terminator is a period and the next non–space character is lowercase, assume not a boundary.
        if (c === "." && n < len && /[a-z]/.test(this.buffer[n])) {
          ++i;
          continue;
        }
        const sentence = this.buffer.substring(flushIndex, j + 1).trim();

        // --- Special case: ellipsis starting a sentence should be merged into the next one ---
        if (sentence === "..." || sentence === "…") {
          ++i;
          continue;
        }

        // Accept the sentence boundary.
        if (sentence) sentences.push(sentence);
        i = flushIndex = j + 1;
        continue;
      }
      ++i;
    }

    // Remove the processed portion of the buffer.
    this.buffer = this.buffer.substring(flushIndex);

    // Emit every complete sentence.
    for (const s of sentences) {
      if (s.length > 0) {
        this.callback(s);
      }
    }
  }
}

/**
 * Split text into sentences
 * @param {string} text The input text
 * @returns {string[]} The list of sentences
 */
export function split(text) {
  const sentences = [];
  const splitter = new TextSplitterStream((chunk) => sentences.push(chunk));
  splitter.push(text);
  splitter.close();
  return sentences;
}
