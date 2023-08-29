export type OmitMethods<T extends Object> = Pick<T, PropertieKeysOnly<T>>;
type PropertieKeysOnly<T extends Object> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
