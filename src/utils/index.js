export const handleAsync = (promise, defaultValue, action) => {
  action?.();
  return handleError(
    Promise.resolve(promise)
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve([undefined, error])),
    defaultValue
  );
};

export function getFilteredMatches(filter, collection) {
  return collection
    .filter((item) => item.includes(filter))
    .sort((a, b) => a.indexOf(filter) - b.indexOf(filter));
}

export async function handleError(promise, defaultValue) {
  const [value, error] = await promise;
  if (error) {
    console.error(error);
    return defaultValue;
  }
  return value;
}

export function searchMapByKey(map, key) {
  return typeof findValue === "function"
    ? map.get([...map.keys()].find(key))
    : map.get(key);
}
