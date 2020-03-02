/**
 * Just a CamelCase to kebab-case transformer (just a copy from the internet)
 * @param text
 */
export function camelToKebabCase(text: string) {
  // When the input was null or undefined, return that same value
  if (text === null || text === undefined) {
    return text;
  }
  // The output string, to be built in the loop
  var result = "";
  // Counts consecutive upper-case characters
  var upper = 0;
  // True when the last character was a number and false when the last
  // character was something other than a number
  var numeric = undefined;
  // Enumerate characters in the input string
  var string = String(text);
  for (var i = 0; i < string.length; i++) {
    var ch = string[i];
    var chLower = ch.toLowerCase();
    // If it's an upper-case letter (not preceded by ascii whitespace):
    if (ch !== chLower) {
      var prev = result[result.length - 1];
      // Handle cases like "innerHTML" => "inner-html",
      // NOT "inner-h-t-m-l"
      if (upper > 1 && result.length > 1) {
        result = result.slice(0, result.length - 2) + prev;
      }
      // Add a hyphen (but not at the beginning of the output, and not
      // two in a row, and not after whitespace)
      if (
        result.length &&
        prev !== "-" &&
        prev !== " " &&
        prev !== "\t" &&
        prev !== "\r" &&
        prev !== "\n"
      ) {
        result += "-";
      }
      // Append the lower-case character
      result += chLower;
      // Update upper-case and numeric state
      upper++;
      numeric = false;
      // If it's a number:
    } else if (
      ch === "0" ||
      ch === "1" ||
      ch === "2" ||
      ch === "3" ||
      ch === "4" ||
      ch === "5" ||
      ch === "6" ||
      ch === "7" ||
      ch === "8" ||
      ch === "9"
    ) {
      // Add a hyphen if the last character wasn't a number (but not
      // two hyphens in a row)
      if (numeric === false && result[result.length - 1] !== "-") {
        result += "-";
      }
      // Append the numeric character
      result += ch;
      // Update upper-case and numeric state
      upper = 0;
      numeric = true;
      // If it's not upper case or a number, but the last character was numeric:
    } else if (numeric && result[result.length - 1] !== "-") {
      // Append a hyphen and then the character
      result += "-" + ch;
      // Update upper-case and numeric state
      upper = 0;
      numeric = false;
      // If it's not upper case or numeric, and not following a number:
    } else {
      // Append the character
      result += ch;
      // Update upper-case and numeric state
      upper = 0;
      numeric = false;
    }
  }
  // Handle cases like "innerHTML" => "inner-html", NOT "inner-htm-l"
  if (upper > 1 && result.length > 1) {
    result = result.slice(0, result.length - 2) + result[result.length - 1];
  }
  // All done!
  return result;
}
