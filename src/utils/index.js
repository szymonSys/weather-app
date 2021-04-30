export const handleAsync = (promise, defaultValue, action) => {
  action?.();
  return handleError(
    Promise.resolve(promise)
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve([undefined, error])),
    defaultValue
  );
};

export const getFilteredMatches = (filter, collection) => {
  const lowerCaseFilter = filter.toLowerCase();
  return collection
    .filter((item) => item?.toLowerCase()?.includes(lowerCaseFilter))
    .sort(
      (a, b) =>
        a?.toLowerCase()?.indexOf(lowerCaseFilter) -
        b?.toLowerCase()?.indexOf(lowerCaseFilter)
    );
};

export async function handleError(promise, defaultValue) {
  const [value, error] = await promise;
  if (error) {
    console.error(error);
    return defaultValue;
  }
  return value;
}

export const searchMapByKey = (map, key) =>
  typeof findValue === "function"
    ? map.get([...map.keys()].find(key))
    : map.get(key);
