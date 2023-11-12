exports.capitalizedFirstChar = function capitalizedFirstChar(str) {
  const firstChar = str.slice(0, 1);
  const restChars = str.slice(1);
  return `${firstChar.toUpperCase()}${restChars}`
}

