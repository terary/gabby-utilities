/**
 *
 * @param obj - source object
 * @param keys - keys to copy from source
 * @return object - newly create object with only key/item from source
 */
const objectFilter = (obj: { [key: string]: any }, ...keys: string[]) => {
  const newObject: { [key: string]: any } = {};
  keys.forEach((key) => {
    newObject[key] = obj[key];
  });
  return newObject;
};

export const helpers = {
  objectFilter,
};
