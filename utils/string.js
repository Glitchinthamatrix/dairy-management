export const capitalize = (str) => {
    // Capitalise the first letter which is required no matter if the is a single word or compound
    let capitalised = str[0].toUpperCase();
    const isCompound = str.toLowerCase() !== str;
    if (isCompound) {
      // if word is compound, check for capital letters and prepend space before them
      for (let i = 1; i < str.length; i++) {
        const asciiValue = str.charCodeAt(i);
        if (asciiValue >= 65 && asciiValue <= 90) {
          capitalised += ` ${str[i]}`;
        } else {
          capitalised += str[i];
        }
      }
    } else {
      // If word is not compound, add the rest part without alterations
      capitalised += str.slice(1, str.length);
    }
    return capitalised;
  };
  