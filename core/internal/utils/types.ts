export type ObjectKey = string | number | symbol;

export interface HashMap<T> {
    [id: string]: T;
}

export interface Newable<T> {
    new (): T;
}

export type FPN<T> = {
    [K in keyof T]: T[K] extends Function ? K : never
}[keyof T];
export type FP<T> = Pick<T, FPN<T>>;

export type NFPN<T> = {
    [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];
export type NFP<T> = Pick<T, NFPN<T>>;

export type SWITCHER<B extends boolean, T, F> = B extends true ? T : F;

export type ExclueKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
