export const handleAsync = (promise) =>
  handleError(
    Promise.resolve(promise)
      .then((data) => [data, undefined])
      .catch((error) => Promise.resolve([undefined, error]))
  );

export function getFilteredMatches(filter, collection) {
  return collection
    .filter((item) => item.includes(filter))
    .sort((a, b) => a.indexOf(filter) - b.indexOf(filter));
}

export function handleError([value, error] = [], onError) {
  if (error) {
    typeof onError === "function" ? onError(error) : console.error(error);
  }
  return value;
}
