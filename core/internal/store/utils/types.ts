export type ObjectKey = string | number | symbol;

export interface HashMap<T> {
    [id: string]: T;
}

export type StateFn<T, R = T> = (state: T) => R;

export type ExclueKeys<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
