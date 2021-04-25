export const handleAsync = (promise, action) => {
  action?.();
  return handleError(
    Promise.resolve(promise)
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve([undefined, error]))
  );
};

export function getFilteredMatches(filter, collection) {
  return collection
    .filter((item) => item.includes(filter))
    .sort((a, b) => a.indexOf(filter) - b.indexOf(filter));
}

export async function handleError(promise) {
  const [value, error] = await promise;
  if (error) {
    console.error(error);
  }
  return value;
}

export function searchMapByKey(map, key) {
  return typeof findValue === "function"
    ? map.get([...map.keys()].find(key))
    : map.get(key);
}
