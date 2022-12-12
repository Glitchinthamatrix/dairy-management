export function isObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

export function getFieldValue(obj, field) {
  let value = null;
  if (field.includes(".")) {
    const fields = field.split(".");
    for (let field of fields) {
      value = obj ? obj[field] : null;
      obj = value;
      if (value === null) {
        break;
      }
    }
  } else {
    value = obj ? obj[field] : null;
  }
  return value;
}

export function nullifyFalsyValues(obj) {
  if (!isObject(obj)) {
    return;
  }
  for (let key in obj) {
    const currentValue = obj[key];
    if (!isObject(currentValue)) {
      if (currentValue === null) {
        continue;
      }
      if (currentValue === undefined) {
        obj[key] = null;
        continue;
      }
      if (currentValue.toString().trim() === "") {
        obj[key] = null;
      }
    } else {
      nullifyFalsyValues(obj[key]);
    }
  }
}
