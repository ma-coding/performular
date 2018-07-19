export function isFunction<T>(value: any): value is T {
    return typeof value === 'function';
}
