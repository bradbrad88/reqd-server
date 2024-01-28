type MapKey = string | number | symbol;

export function convertMapToObject<T>(map: Map<MapKey, T>) {
  const obj: { [key: MapKey]: T } = {};
  for (const [id, item] of map.entries()) {
    if (
      item &&
      typeof item === "object" &&
      "toJSON" in item &&
      typeof item.toJSON === "function"
    ) {
      obj[id] = item.toJSON();
    } else {
      obj[id] = item;
    }
  }
  return obj;
}

type Transform<T, K> = (item: T) => K;

export function convertObjectToMap<T, K>(
  obj: { [key: MapKey]: T },
  transform: Transform<any, K> = item => {
    return item;
  }
) {
  const map = new Map<MapKey, K>();
  for (const id in obj) {
    const item = transform(obj[id]);
    map.set(id, item);
  }
  return map;
}
