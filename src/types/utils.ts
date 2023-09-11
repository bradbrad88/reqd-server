export type Json<T extends Object> = Pick<T, NoUnderscoredProperties<PropertieKeysOnly<T>>>;

type NoUnderscoredProperties<T extends string> = Exclude<T, Underscored<string>>;

type PropertieKeysOnly<T extends Object> = {
  [K in keyof T]: T[K] extends Function ? never : K extends string ? K : never;
}[keyof T];

type Underscored<Str extends string> = Str extends number ? never : `_${Str}`;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
