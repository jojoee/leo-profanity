/** Options for the clean() method */
interface CleanOptions {
  /** Character to replace profanity with (default: '*') */
  replaceKey?: string;
  /** Number of letters to keep from beginning (default: 0) */
  nbLetters?: number;
}

declare const LeoProfanity: {
  /** Dictionary of word lists by language */
  wordDictionary: Record<string, string[]>;

  /** Current active word list */
  words: string[];

  /**
   * Return all current profanity words
   * @returns Array of profanity words
   */
  list(): string[];

  /**
   * Check if the string contains profanity words
   * @param str - String to check
   * @returns True if profanity word found
   */
  check(str: string): boolean;

  /**
   * Replace profanity words in string
   * @param str - String to clean
   * @param replaceKey - Character to replace with (default: '*')
   * @param nbLetters - Number of letters to keep from beginning (default: 0)
   * @returns Cleaned string
   */
  clean(str: string, replaceKey?: string, nbLetters?: number): string;

  /**
   * Replace profanity words in string using options object
   * @param str - String to clean
   * @param options - Options object with replaceKey and nbLetters
   * @returns Cleaned string
   */
  clean(str: string, options?: CleanOptions): string;

  /**
   * Get list of bad words used in string
   * @param str - String to check
   * @returns Array of bad words found
   */
  badWordsUsed(str: string): string[];

  /**
   * Add word(s) to the list
   * @param data - Word or array of words to add
   * @returns this for chaining
   */
  add(data: string | string[]): typeof LeoProfanity;

  /**
   * Remove word(s) from the list
   * @param data - Word or array of words to remove
   * @returns this for chaining
   */
  remove(data: string | string[]): typeof LeoProfanity;

  /**
   * Reset word list to default English dictionary
   * @returns this for chaining
   */
  reset(): typeof LeoProfanity;

  /**
   * Clear all words from the list
   * @returns this for chaining
   */
  clearList(): typeof LeoProfanity;

  /**
   * Get word list from dictionary
   * @param name - Dictionary name (default: 'en')
   * @returns Array of words from dictionary
   */
  getDictionary(name?: string): string[];

  /**
   * Load word list from dictionary
   * @param name - Dictionary name (default: 'en')
   */
  loadDictionary(name?: string): void;

  /**
   * Add or create a new dictionary
   * @param name - Dictionary name
   * @param words - Array of words
   * @returns this for chaining
   */
  addDictionary(name: string, words: string[]): typeof LeoProfanity;

  /**
   * Remove a dictionary
   * @param name - Dictionary name to remove
   * @returns this for chaining
   */
  removeDictionary(name: string): typeof LeoProfanity;

  /**
   * Add word(s) to whitelist (words that should not be filtered)
   * @param data - Word or array of words to whitelist
   * @returns this for chaining
   */
  addWhitelist(data: string | string[]): typeof LeoProfanity;

  /**
   * Remove word(s) from whitelist
   * @param data - Word or array of words to remove from whitelist
   * @returns this for chaining
   */
  removeWhitelist(data: string | string[]): typeof LeoProfanity;

  /**
   * Clear all words from whitelist
   * @returns this for chaining
   */
  clearWhitelist(): typeof LeoProfanity;

  /**
   * Get all whitelisted words
   * @returns Array of whitelisted words
   */
  getWhitelist(): string[];
};

export = LeoProfanity;
export as namespace LeoProfanity;
