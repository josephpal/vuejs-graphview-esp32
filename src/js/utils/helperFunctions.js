/* http://tramaine.me/blog/use-typeof-to-check-javascript-data-types-at-runtime */
/* https://www.w3schools.com/jsref/jsref_parseint.asp */
/* https://stackoverflow.com/questions/9939760/how-do-i-convert-an-integer-to-binary-in-javascript */

/* input: type string, bit: type integer */
export const dec2Binary = (input, bit) => {
  // return result
  let result = "";

  if( typeof bit !== 'number' ) {
    console.error("expected integer as second parameter of dec2Binary(String, Integer). Parsing ...");
    bit = parseInt(bit);
  }

  if (input != "") {
    // as an input number
    let n = parseInt(input);
    bit = bit - 1;

    do {
      if ((n >> bit) & 1)
        result += "1";
      else
        result += "0";

      --bit;
    } while (bit >= 0);
  }

  return result;
}

/* a: type integer, b: type integer */
export const gd = (a, b) => {
  if( typeof a !== 'number' ) {
    console.error("expected integer as first parameter of gd(Integer, Integer). Parsing ...");
    a = parseInt(a);
  }

  if( typeof b !== 'number' ) {
    console.error("expected integer as second parameter of gd(Integer, Integer). Parsing ...");
    b = parseInt(b);
  }

	if( a < b ) {
		let c = a;
		a = b;
		b = c;
	}

	while( a%b != 0 ) {
		b--;
	}

	return b;
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
