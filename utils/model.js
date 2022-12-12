function requireArrayValues(array, requirement) {
  if (!array) {
    throw new Error("Array is required to check required values");
  }
  return requirement ? array.length >= requirement : array.length > 0;
}

export default { requireArrayValues };
