/**
 * for literal unions
 * @example Sub<'Y' | 'X', 'X'> // === 'Y'
 */
export type Sub<
    O extends string | number | symbol,
    D extends string | number | symbol
> = {
    [K in O]: (Record<D, never> & Record<string | number | symbol, K>)[K]
}[O];

/**
 * Remove the keys represented by the string union type D from the object type O.
 *
 * @example RemoveKey<{a: number, b: string}, 'a'> // === {b: string}
 * @example RemoveKey<{a: number, b: string}, keyof {a: number}> // === {b: string}
 */
export type RemoveKey<O, D extends string | number | symbol> = Pick<
    O,
    Sub<keyof O, D>
>;
