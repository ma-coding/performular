export function cloneDeep(o: any): any {
    const gdcc: string = '__getDeepCircularCopy__';
    if (o !== Object(o)) {
        return o; // primitive value
    }

    const set: boolean = gdcc in o;
    const cache: any = o[gdcc];
    let result: any;
    if (set && typeof cache === 'function') {
        return cache();
    }
    // else
    o[gdcc] = (): any => result; // overwrite
    if (o instanceof Array) {
        result = [];
        for (let i: number = 0; i < o.length; i++) {
            result[i] = cloneDeep(o[i]);
        }
    } else {
        result = {};
        for (const prop in o) {
            if (prop !== gdcc) {
                result[prop] = cloneDeep(o[prop]);
            } else if (set) {
                result[prop] = cloneDeep(cache);
            }
        }
    }
    if (set) {
        o[gdcc] = cache; // reset
    } else {
        delete o[gdcc]; // unset again
    }
    return result;
}
