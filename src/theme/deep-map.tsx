type AnyObject = Record<string, unknown>;

const isObject = (value: unknown): value is AnyObject =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const mapObject = (
  obj: AnyObject,
  fn: (value: unknown) => unknown,
): AnyObject =>
  Object.keys(obj).reduce<AnyObject>((result, key) => {
    result[key] = fn(obj[key]);
    return result;
  }, {});

const deepMap = (obj: unknown, fn: (value: unknown) => unknown): unknown => {
  const deepMapper = (value: unknown): unknown =>
    isObject(value) || Array.isArray(value) ? deepMap(value, fn) : fn(value);

  if (Array.isArray(obj)) {
    return obj.map(deepMapper);
  }

  if (isObject(obj)) {
    return mapObject(obj, deepMapper);
  }

  return obj;
};

export default deepMap;
