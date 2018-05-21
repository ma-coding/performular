
/**
 * Function that returns an unique string.
 * @export
 * @returns an unique string
 */
export function generateUUID(): string {
    const s4: () => string = (): string => {
        // tslint:disable-next-line:no-magic-numbers
        return Math.floor((1 + Math.random()) * 0x10000)
            // tslint:disable-next-line:no-magic-numbers
            .toString(16)
            .substring(1);
    };
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
