export function mapToInputs(
    keyName: string,
    input: any,
    mapValue: (val: any) => any = (val: any): any => val
): any {
    if (!input) {
        return {};
    }
    return Object.keys(input).reduce((layout: any, current: string) => {
        layout[getKeyName(keyName, current)] = mapValue(input[current]);
        return layout;
    }, {});
}

export function getKeyName(keyName: string, current: string): string {
    if (current === 'main') {
        return keyName;
    } else {
        return `${keyName}${capitalizeFirstLetter(current)}`;
    }
}

export function capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}
