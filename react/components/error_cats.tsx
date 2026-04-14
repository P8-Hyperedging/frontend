export function errorCodeCatImage(errorCode: number) {
  return (
    <img
      src={`https://http.cat/images/${errorCode}.jpg`}
      alt={`Error ${errorCode}`}
    />
  );
}
