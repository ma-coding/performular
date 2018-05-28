export type T = Extract<Array<string>, 0>;

export interface MyArray extends Record<T, string> {
    0: number;
}

const A: MyArray = [22, 'asdv', '', 123];
